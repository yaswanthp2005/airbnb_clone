import { Suspense } from "react";
import { notFound } from "next/navigation";

import ListingDetail from "@/components/listingDetail";
import ListingDetailSkeleton from "@/components/listingDetail/ListingDetailSkeleton";

export default async function ListingPage({ params }: PageProps<"/listings/[slug]">) {
  const { slug } = await params;
  const listingSlug = decodeURIComponent(slug).trim();
  if (!listingSlug) {
    notFound();
  }

  return (
    <Suspense fallback={<ListingDetailSkeleton />}>
      <ListingDetail listingSlug={listingSlug} />
    </Suspense>
  );
}
