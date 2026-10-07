import { notFound } from "next/navigation";

import EditListing from "@/components/hosting/EditListing";

export default async function EditListingPage({ params }: PageProps<"/hosting/listings/[id]/edit">) {
  const { id } = await params;
  const listingId = Number(id);
  if (!Number.isInteger(listingId) || listingId < 1) {
    notFound();
  }

  return <EditListing listingId={listingId} />;
}
