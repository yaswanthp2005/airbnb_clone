"use client";

import { useMemo } from "react";

import { t } from "@/common/i18n";
import { EMPTY_LISTING_FILTERS } from "@/components/listings/constants";
import { routes } from "@/constants/routes";
import { useListingsInfinite } from "@/queries/listings";
import { buildUrl } from "@/utils/buildUrl";

import { HOME_CARD_WIDTH_CLASS_NAME } from "./constants";
import ListingCard from "@/components/listings/ListingCard";
import HomeRow from "./HomeRow";
import HomeRowSkeleton from "./HomeRowSkeleton";

type PopularHomesRowProps = {
  city: string;
};

const PopularHomesRow = ({ city }: PopularHomesRowProps) => {
  // Same filters (and cache entry) as the city's search results page.
  const filters = useMemo(() => ({ ...EMPTY_LISTING_FILTERS, location: city }), [city]);
  const { data, isPending } = useListingsInfinite(filters);
  const listings = data?.pages[0]?.items ?? [];

  if (isPending) {
    return <HomeRowSkeleton cardWidthClassName={HOME_CARD_WIDTH_CLASS_NAME} />;
  }
  if (listings.length === 0) {
    return null;
  }

  return (
    <HomeRow
      title={t("home.popularIn", { city })}
      href={buildUrl({ path: routes.search, query: { location: city } })}
    >
      {listings.map(listing => (
        <ListingCard key={listing.id} listing={listing} variant="homeRow" />
      ))}
    </HomeRow>
  );
};

export default PopularHomesRow;
