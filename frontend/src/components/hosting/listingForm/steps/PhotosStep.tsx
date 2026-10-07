"use client";

import { useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, ImageOff, Plus, X } from "lucide-react";

import { t } from "@/common/i18n";
import RemoteImage from "@/components/common/RemoteImage";
import { cn } from "@/lib/utils";

import { LISTING_LIMITS, PHOTO_PREVIEW_SIZES } from "../constants";
import { FORM_INPUT_CLASS_NAME, StepError, fieldErrorId } from "../FormField";
import type { StepProps } from "../types";
import { photoUrlError } from "../utils";

type PhotosStepProps = StepProps & {
  brokenPhotos: string[];
  onPhotoStatusChange: (url: string, isBroken: boolean) => void;
};

const INPUT_ID = "listing-photo-url";

const photoActionClassName =
  "flex size-8 items-center justify-center rounded-full bg-surface-raised/95 text-ink shadow-sm transition-transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100";

const PhotosStep = ({ values, errors, onChange, brokenPhotos, onPhotoStatusChange }: PhotosStepProps) => {
  const [draftUrl, setDraftUrl] = useState("");
  const [draftError, setDraftError] = useState<string | null>(null);
  const { photos } = values;

  const addPhoto = (event: FormEvent) => {
    event.preventDefault();
    const url = draftUrl.trim();
    const error = photoUrlError(url, photos);
    setDraftError(error);
    if (!error) {
      onChange({ photos: [...photos, url] });
      setDraftUrl("");
    }
  };

  const movePhoto = (index: number, offset: number) => {
    const next = [...photos];
    [next[index], next[index + offset]] = [next[index + offset], next[index]];
    onChange({ photos: next });
  };

  const removePhoto = (index: number) => {
    onPhotoStatusChange(photos[index], false);
    onChange({ photos: photos.filter((_, position) => position !== index) });
  };

  return (
    <div className="flex flex-col gap-5">
      <form onSubmit={addPhoto} className="flex flex-col gap-1.5" noValidate>
        <div className="flex items-baseline justify-between gap-2">
          <label htmlFor={INPUT_ID} className="text-sm font-semibold text-ink">
            {t("hosting.form.fields.photoUrl")}
          </label>
          <span className="text-sm text-ink-muted">
            {t("hosting.form.fields.photoCount", { count: photos.length, max: LISTING_LIMITS.maxPhotos })}
          </span>
        </div>
        <div className="flex gap-2">
          <input
            id={INPUT_ID}
            type="url"
            inputMode="url"
            value={draftUrl}
            maxLength={LISTING_LIMITS.photoUrlMax}
            placeholder={t("hosting.form.fields.photoUrlPlaceholder")}
            aria-invalid={Boolean(draftError)}
            aria-describedby={draftError ? fieldErrorId(INPUT_ID) : undefined}
            onChange={event => {
              setDraftUrl(event.target.value);
              setDraftError(null);
            }}
            className={FORM_INPUT_CLASS_NAME}
          />
          <button
            type="submit"
            disabled={draftUrl.trim() === ""}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-ink px-5 text-sm font-semibold text-on-ink transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            <Plus className="size-4" aria-hidden="true" />
            {t("hosting.form.fields.addPhoto")}
          </button>
        </div>
        <StepError id={fieldErrorId(INPUT_ID)} error={draftError ?? undefined} />
      </form>

      <StepError id="photos-error" error={errors.photos} />

      {photos.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-surface-strong px-6 py-12 text-center text-ink-muted">
          <ImageOff className="size-8" strokeWidth={1.5} aria-hidden="true" />
          <p className="text-sm">{t("hosting.form.fields.noPhotos")}</p>
        </div>
      ) : (
        <ol className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {photos.map((url, index) => {
            const position = index + 1;
            const isBroken = brokenPhotos.includes(url);
            const isCover = index === 0;
            return (
              <li
                key={url}
                data-photo-url={url}
                className={cn(
                  "group relative overflow-hidden rounded-xl bg-surface-muted",
                  isCover ? "col-span-2 aspect-[3/2] md:col-span-3 md:aspect-[2/1]" : "aspect-square",
                  isBroken && "ring-2 ring-destructive",
                )}
              >
                {isBroken ? (
                  <div className="flex size-full flex-col items-center justify-center gap-2 p-3 text-center text-destructive">
                    <ImageOff className="size-6" aria-hidden="true" />
                    <span className="text-xs">{t("hosting.form.fields.photoBroken")}</span>
                  </div>
                ) : (
                  <RemoteImage
                    src={url}
                    alt={t("hosting.form.fields.photoAlt", { position })}
                    fill
                    sizes={PHOTO_PREVIEW_SIZES}
                    className="object-cover"
                    onLoad={() => onPhotoStatusChange(url, false)}
                    onError={() => onPhotoStatusChange(url, true)}
                  />
                )}
                {isCover ? (
                  <span className="absolute left-3 top-3 rounded-full bg-surface px-3 py-1 text-xs font-semibold text-ink shadow-sm">
                    {t("hosting.form.fields.coverPhoto")}
                  </span>
                ) : null}
                <div className="absolute right-2 top-2 flex gap-1.5">
                  <button
                    type="button"
                    aria-label={t("hosting.form.fields.movePhotoEarlier", { position })}
                    disabled={index === 0}
                    onClick={() => movePhoto(index, -1)}
                    className={photoActionClassName}
                  >
                    <ArrowLeft className="size-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label={t("hosting.form.fields.movePhotoLater", { position })}
                    disabled={index === photos.length - 1}
                    onClick={() => movePhoto(index, 1)}
                    className={photoActionClassName}
                  >
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label={t("hosting.form.fields.removePhoto", { position })}
                    onClick={() => removePhoto(index)}
                    className={photoActionClassName}
                  >
                    <X className="size-4" aria-hidden="true" />
                  </button>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
};

export default PhotosStep;
