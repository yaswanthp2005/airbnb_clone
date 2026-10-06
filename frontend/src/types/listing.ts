export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
};

export type ListingSummary = {
  id: number;
  title: string;
  propertyType: string;
  city: string;
  state: string;
  country: string;
  pricePerNight: number;
  bedrooms: number;
  beds: number;
  maxGuests: number;
  ratingAvg: number;
  reviewCount: number;
  photos: string[];
  isWishlisted: boolean;
};

export type ListingSort =
  | "recommended"
  | "price_asc"
  | "price_desc"
  | "rating_desc"
  | "newest";

export type ListingFilters = {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyType: string[];
  amenities: number[];
  bedrooms?: number;
  location?: string;
  /** `yyyy-MM-dd` */
  checkIn?: string;
  /** `yyyy-MM-dd` */
  checkOut?: string;
  adults?: number;
  children?: number;
  infants?: number;
  pets?: number;
  sort?: ListingSort;
};

export type LocationSuggestion = {
  city: string;
  state: string;
  country: string;
  listingCount: number;
};

export type Amenity = {
  id: number;
  name: string;
  icon?: string | null;
};

export type ListingFilterOptions = {
  minPrice: number;
  maxPrice: number;
  priceHistogram: number[];
  propertyTypes: string[];
  amenities: Amenity[];
};
