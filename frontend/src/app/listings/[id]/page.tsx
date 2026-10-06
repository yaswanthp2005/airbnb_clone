import { Suspense } from "react";
import { notFound } from "next/navigation";

import ListingDetail from "@/components/listingDetail";
import ListingDetailSkeleton from "@/components/listingDetail/ListingDetailSkeleton";

export default async function ListingPage({ params }: PageProps<"/listings/[id]">) {
  const { id } = await params;
  const listingId = Number(id);
  if (!Number.isInteger(listingId) || listingId < 1) {
    notFound();
  }

  return (
    <Suspense fallback={<ListingDetailSkeleton />}>
      <ListingDetail listingId={listingId} />
    </Suspense>
  );
}
