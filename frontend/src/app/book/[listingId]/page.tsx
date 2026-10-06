import { Suspense } from "react";
import { notFound } from "next/navigation";

import RequireAuth from "@/components/auth/RequireAuth";
import BookingCheckout from "@/components/booking";
import BookingCheckoutSkeleton from "@/components/booking/BookingCheckoutSkeleton";

export default async function BookPage({ params }: PageProps<"/book/[listingId]">) {
  const { listingId } = await params;
  const id = Number(listingId);
  if (!Number.isInteger(id) || id < 1) {
    notFound();
  }

  return (
    <RequireAuth>
      <Suspense fallback={<BookingCheckoutSkeleton />}>
        <BookingCheckout listingId={id} />
      </Suspense>
    </RequireAuth>
  );
}
