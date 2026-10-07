import type { Review } from "@/types/listing";

export type CreateReviewInput = {
  bookingId: number;
  rating: number;
  comment: string;
};

export type CreatedReview = Review & {
  listingId: number;
  bookingId: number;
};
