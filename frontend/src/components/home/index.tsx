"use client";

import { t } from "@/common/i18n";
import ListingsEmptyState from "@/components/listings/ListingsEmptyState";
import { useDestinations } from "@/queries/destinations";
import { usePropertyTypes } from "@/queries/listings";

import {
  DESTINATION_CARD_WIDTH_CLASS_NAME,
  DESTINATION_EAGER_COUNT,
  HOME_CARD_WIDTH_CLASS_NAME,
  POPULAR_CITY_ROW_COUNT,
} from "./constants";
import DestinationCard from "./DestinationCard";
import HomeRow from "./HomeRow";
import HomeRowSkeleton from "./HomeRowSkeleton";
import PopularHomesRow from "./PopularHomesRow";
import PropertyTypeCard from "./PropertyTypeCard";

const HomeSections = () => {
  const destinations = useDestinations();
  const propertyTypes = usePropertyTypes();

  if (destinations.isError && propertyTypes.isError) {
    return (
      <ListingsEmptyState
        title={t("listings.error.title")}
        description={t("listings.error.description")}
        actionLabel={t("listings.error.retry")}
        onAction={() => {
          destinations.refetch();
          propertyTypes.refetch();
        }}
      />
    );
  }

  const popularCities = (destinations.data ?? []).slice(0, POPULAR_CITY_ROW_COUNT);

  return (
    <div className="flex flex-col gap-10 md:gap-12">
      {destinations.isPending ? (
        <>
          <HomeRowSkeleton cardWidthClassName={DESTINATION_CARD_WIDTH_CLASS_NAME} />
          {Array.from({ length: POPULAR_CITY_ROW_COUNT }, (_, index) => (
            <HomeRowSkeleton key={index} cardWidthClassName={HOME_CARD_WIDTH_CLASS_NAME} />
          ))}
        </>
      ) : null}

      {destinations.data?.length ? (
        <HomeRow title={t("home.destinationsTitle")}>
          {destinations.data.map((destination, index) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
              isEager={index < DESTINATION_EAGER_COUNT}
            />
          ))}
        </HomeRow>
      ) : null}

      {popularCities.map(destination => (
        <PopularHomesRow key={destination.id} city={destination.city} />
      ))}

      {propertyTypes.isPending ? (
        <HomeRowSkeleton cardWidthClassName={HOME_CARD_WIDTH_CLASS_NAME} />
      ) : null}
      {propertyTypes.data?.length ? (
        <HomeRow title={t("home.browseByType")}>
          {propertyTypes.data.map(summary => (
            <PropertyTypeCard key={summary.propertyType} summary={summary} />
          ))}
        </HomeRow>
      ) : null}
    </div>
  );
};

export default HomeSections;
