import type { BookingStatus, BookingTab } from "@/types/booking";
import type { Amenity } from "@/types/listing";

/** Body of POST / PUT `/host/listings`; PUT replaces the whole listing. */
export type HostListingInput = {
  title: string;
  description: string;
  propertyType: string;
  address: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  pricePerNight: number;
  cleaningFee: number;
  maxGuests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  /** Ordered; the first photo is the cover. */
  photos: string[];
  amenities: number[];
};

export type HostListing = Omit<HostListingInput, "latitude" | "longitude"> & {
  id: number;
  slug: string;
  latitude: number;
  longitude: number;
  ratingAvg: number;
  reviewCount: number;
  upcomingBookingCount: number;
  createdAt: string;
};

export type HostBookingTab = BookingTab;

export type HostBooking = {
  id: number;
  listing: {
    id: number;
    slug: string;
    title: string;
    city: string;
    photoUrl: string | null;
  };
  guest: {
    id: number;
    name: string;
    avatarUrl: string | null;
  };
  /** `yyyy-MM-dd` */
  checkIn: string;
  /** `yyyy-MM-dd` */
  checkOut: string;
  nights: number;
  guests: number;
  totalPrice: number;
  /** Total minus the guest service fee. */
  hostPayout: number;
  status: BookingStatus;
  createdAt: string;
};

export type HostStats = {
  listingCount: number;
  upcomingReservations: number;
  totalEarnings: number;
  ratingAvg: number;
  reviewCount: number;
};

export type HostListingOptions = {
  propertyTypes: string[];
  amenities: Amenity[];
};
