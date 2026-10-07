import { Suspense } from "react";
import { notFound } from "next/navigation";

import RequireAuth from "@/components/auth/RequireAuth";
import BookingCheckout from "@/components/booking";
import BookingCheckoutSkeleton from "@/components/booking/BookingCheckoutSkeleton";

export default async function BookPage({ params }: PageProps<"/book/[slug]">) {
  const { slug } = await params;
  const listingSlug = decodeURIComponent(slug).trim();
  if (!listingSlug) {
    notFound();
  }

  return (
    <RequireAuth>
      <Suspense fallback={<BookingCheckoutSkeleton />}>
        <BookingCheckout listingSlug={listingSlug} />
      </Suspense>
    </RequireAuth>
  );
}
