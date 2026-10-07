"use client";

import Link from "next/link";

import { t } from "@/common/i18n";
import PageContainer from "@/components/layout/PageContainer";
import { Skeleton } from "@/components/ui/skeleton";
import { routes } from "@/constants/routes";
import { useHostListing } from "@/queries/host";

import ListingForm from "./listingForm";

type EditListingProps = {
  listingId: number;
};

const EditListing = ({ listingId }: EditListingProps) => {
  const { data: listing, isPending, isError } = useHostListing(listingId);

  if (isPending) {
    return (
      <PageContainer width="narrow" className="pt-8">
        <div className="mx-auto flex max-w-2xl flex-col gap-6" aria-busy="true">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </PageContainer>
    );
  }

  if (isError) {
    return (
      <PageContainer width="narrow" className="py-16">
        <div className="mx-auto flex max-w-md flex-col items-center gap-3 text-center">
          <h1 className="text-[22px] font-semibold text-ink">{t("hosting.form.notFoundTitle")}</h1>
          <p className="text-ink-muted">{t("hosting.form.notFoundDescription")}</p>
          <Link
            href={routes.hosting}
            className="mt-3 rounded-lg border border-ink px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-surface-muted"
          >
            {t("hosting.form.backToListings")}
          </Link>
        </div>
      </PageContainer>
    );
  }

  return <ListingForm key={listing.id} listing={listing} />;
};

export default EditListing;
