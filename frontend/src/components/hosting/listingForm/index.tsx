"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { t } from "@/common/i18n";
import PageContainer from "@/components/layout/PageContainer";
import { routes } from "@/constants/routes";
import { cn } from "@/lib/utils";
import {
  useCreateHostListing,
  useHostListingOptions,
  useUpdateHostListing,
} from "@/queries/host";
import type { HostListing } from "@/types/host";

import { LISTING_FORM_STEPS } from "./constants";
import AmenitiesStep from "./steps/AmenitiesStep";
import BasicsStep from "./steps/BasicsStep";
import DescriptionStep from "./steps/DescriptionStep";
import LocationStep from "./steps/LocationStep";
import PhotosStep from "./steps/PhotosStep";
import PriceStep from "./steps/PriceStep";
import PropertyTypeStep from "./steps/PropertyTypeStep";
import type { ListingFormErrors, ListingFormStep, ListingFormValues } from "./types";
import {
  EMPTY_LISTING_FORM,
  formValuesToInput,
  hasErrors,
  listingToFormValues,
  validateStep,
} from "./utils";

type ListingFormProps = {
  /** Edit mode when given; otherwise a new listing is created. */
  listing?: HostListing;
};

const LAST_STEP_INDEX = LISTING_FORM_STEPS.length - 1;

const ListingForm = ({ listing }: ListingFormProps) => {
  const router = useRouter();
  const isEdit = listing !== undefined;
  const [values, setValues] = useState<ListingFormValues>(() =>
    listing ? listingToFormValues(listing) : EMPTY_LISTING_FORM,
  );
  const [stepIndex, setStepIndex] = useState(0);
  const [errors, setErrors] = useState<ListingFormErrors>({});
  const [brokenPhotos, setBrokenPhotos] = useState<string[]>([]);
  const { data: options } = useHostListingOptions();
  const createListing = useCreateHostListing();
  const updateListing = useUpdateHostListing();
  const isSaving = createListing.isPending || updateListing.isPending;

  const step = LISTING_FORM_STEPS[stepIndex];
  const isLastStep = stepIndex === LAST_STEP_INDEX;
  const progress = ((stepIndex + 1) / LISTING_FORM_STEPS.length) * 100;

  const handleChange = (patch: Partial<ListingFormValues>) => {
    setValues(previous => ({ ...previous, ...patch }));
    setErrors(previous => {
      const next = { ...previous };
      (Object.keys(patch) as (keyof ListingFormValues)[]).forEach(key => delete next[key]);
      return next;
    });
  };

  const handlePhotoStatusChange = (url: string, isBroken: boolean) => {
    setBrokenPhotos(previous => {
      const without = previous.filter(item => item !== url);
      return isBroken ? [...without, url] : without;
    });
    if (!isBroken) {
      setErrors(previous => {
        const next = { ...previous };
        delete next.photos;
        return next;
      });
    }
  };

  const goToStep = (index: number) => {
    setStepIndex(index);
    window.scrollTo({ top: 0 });
  };

  /** Edit mode can jump between steps, so every step is checked before saving. */
  const firstInvalidStep = (): [number, ListingFormErrors] | null => {
    for (const [index, formStep] of LISTING_FORM_STEPS.entries()) {
      const stepErrors = validateStep(formStep, values, { brokenPhotos });
      if (hasErrors(stepErrors)) {
        return [index, stepErrors];
      }
    }
    return null;
  };

  const submit = () => {
    const invalid = firstInvalidStep();
    if (invalid) {
      setErrors(invalid[1]);
      goToStep(invalid[0]);
      return;
    }
    const input = formValuesToInput(values);
    const onSuccess = () => router.push(routes.hosting);
    if (listing) {
      updateListing.mutate({ listingId: listing.id, input }, { onSuccess });
    } else {
      createListing.mutate(input, { onSuccess });
    }
  };

  const handleNext = () => {
    const stepErrors = validateStep(step, values, { brokenPhotos });
    if (hasErrors(stepErrors)) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    if (isLastStep) {
      submit();
      return;
    }
    goToStep(stepIndex + 1);
  };

  const renderStep = (current: ListingFormStep) => {
    const stepProps = { values, errors, onChange: handleChange };
    switch (current) {
      case "propertyType":
        return <PropertyTypeStep {...stepProps} propertyTypes={options?.propertyTypes} />;
      case "location":
        return <LocationStep {...stepProps} />;
      case "basics":
        return <BasicsStep {...stepProps} />;
      case "amenities":
        return <AmenitiesStep {...stepProps} amenities={options?.amenities} />;
      case "photos":
        return (
          <PhotosStep
            {...stepProps}
            brokenPhotos={brokenPhotos}
            onPhotoStatusChange={handlePhotoStatusChange}
          />
        );
      case "description":
        return <DescriptionStep {...stepProps} />;
      case "price":
        return <PriceStep {...stepProps} />;
    }
  };

  const submitLabel = isEdit
    ? t(isSaving ? "hosting.form.saving" : "hosting.form.save")
    : t(isSaving ? "hosting.form.publishing" : "hosting.form.publish");

  return (
    // Header is h-20; the sticky bar rests above the site footer instead of covering it.
    <div className="flex min-h-[calc(100dvh-5rem)] flex-col">
      <PageContainer width="narrow" className="flex-1 pb-12 pt-8">
        <div className="mx-auto flex max-w-2xl flex-col gap-8">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-semibold text-ink-muted">
              {t(isEdit ? "hosting.form.editTitle" : "hosting.form.createTitle")}
              <span aria-hidden="true"> · </span>
              {t("hosting.form.stepOf", { current: stepIndex + 1, total: LISTING_FORM_STEPS.length })}
            </p>
            <Link
              href={routes.hosting}
              className="rounded-full border border-hairline px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-ink"
            >
              {t("hosting.form.exit")}
            </Link>
          </div>

          {isEdit ? (
            <nav aria-label={t("hosting.form.editSteps")} className="flex flex-wrap gap-2">
              {LISTING_FORM_STEPS.map((formStep, index) => (
                <button
                  key={formStep}
                  type="button"
                  aria-current={index === stepIndex ? "step" : undefined}
                  onClick={() => {
                    setErrors({});
                    goToStep(index);
                  }}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    index === stepIndex
                      ? "border-ink bg-ink text-white"
                      : "border-hairline text-ink hover:border-ink",
                  )}
                >
                  {t(`hosting.form.stepLabels.${formStep}`)}
                </button>
              ))}
            </nav>
          ) : null}

          <section aria-labelledby="listing-step-title" className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <h1 id="listing-step-title" className="text-[32px] font-semibold leading-tight text-ink">
                {t(`hosting.form.steps.${step}.title`)}
              </h1>
              <p className="text-base text-ink-muted">{t(`hosting.form.steps.${step}.description`)}</p>
            </div>
            {renderStep(step)}
          </section>
        </div>
      </PageContainer>

      <footer className="sticky bottom-0 z-30 bg-white">
        <div
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={LISTING_FORM_STEPS.length}
          aria-valuenow={stepIndex + 1}
          aria-label={t("hosting.form.stepOf", { current: stepIndex + 1, total: LISTING_FORM_STEPS.length })}
          className="h-1.5 w-full bg-surface-muted"
        >
          <div className="h-full bg-ink transition-[width] duration-300" style={{ width: `${progress}%` }} />
        </div>
        <PageContainer width="narrow">
          <div className="mx-auto flex h-20 max-w-2xl items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setErrors({});
                goToStep(stepIndex - 1);
              }}
              disabled={stepIndex === 0 || isSaving}
              className="rounded-lg px-3 py-2 text-base font-semibold text-ink underline underline-offset-2 transition-colors hover:bg-surface-muted disabled:invisible"
            >
              {t("hosting.form.back")}
            </button>
            <div className="flex items-center gap-3">
              {isEdit && !isLastStep ? (
                <button
                  type="button"
                  onClick={submit}
                  disabled={isSaving}
                  className="rounded-lg border border-ink px-6 py-3.5 text-base font-semibold text-ink transition-colors hover:bg-surface-muted disabled:opacity-40"
                >
                  {submitLabel}
                </button>
              ) : null}
              <button
                type="button"
                onClick={handleNext}
                disabled={isSaving}
                className={cn(
                  "rounded-lg px-8 py-3.5 text-base font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60",
                  isLastStep ? "bg-brand" : "bg-ink",
                )}
              >
                {isLastStep ? submitLabel : t("hosting.form.next")}
              </button>
            </div>
          </div>
        </PageContainer>
      </footer>
    </div>
  );
};

export default ListingForm;
