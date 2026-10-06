import { notFound } from "next/navigation";

import RequireAuth from "@/components/auth/RequireAuth";
import BookingConfirmation from "@/components/booking/BookingConfirmation";

export default async function BookingPage({ params }: PageProps<"/bookings/[id]">) {
  const { id } = await params;
  const bookingId = Number(id);
  if (!Number.isInteger(bookingId) || bookingId < 1) {
    notFound();
  }

  return (
    <RequireAuth>
      <BookingConfirmation bookingId={bookingId} />
    </RequireAuth>
  );
}
