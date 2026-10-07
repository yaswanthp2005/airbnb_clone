export type BookingStatus = "confirmed" | "cancelled";

export type BookingTab = "upcoming" | "past" | "cancelled";

/** The guest's own review of a stay. */
export type BookingReview = {
  id: number;
  rating: number;
};

export type BookingListing = {
  id: number;
  slug: string;
  title: string;
  propertyType: string;
  city: string;
  state: string;
  country: string;
  photoUrl: string | null;
  hostName: string;
};

export type Booking = {
  id: number;
  listing: BookingListing;
  /** `yyyy-MM-dd` */
  checkIn: string;
  /** `yyyy-MM-dd` */
  checkOut: string;
  nights: number;
  guests: number;
  nightlyPrice: number;
  cleaningFee: number;
  serviceFee: number;
  totalPrice: number;
  status: BookingStatus;
  canCancel: boolean;
  /** Stay is over and not reviewed yet. */
  canReview: boolean;
  review: BookingReview | null;
  createdAt: string;
};

/** Prices are left out on purpose: the server computes them. */
export type CreateBookingInput = {
  listingId: number;
  checkIn: string;
  checkOut: string;
  guests: number;
};
