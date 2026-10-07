import { ExternalLink } from "lucide-react";

import { t } from "@/common/i18n";
import { OSM_SITE_URL } from "@/constants/map";
import type { ListingDetail } from "@/types/listing";

import { LOCATION_MAP_ZOOM, SECTION_IDS } from "./constants";
import LocationMap from "./locationMap";

type LocationSectionProps = {
  listing: Pick<ListingDetail, "city" | "state" | "country" | "latitude" | "longitude">;
};

/** OSM view centred on the area, without a marker, so the exact spot stays private. */
const largerMapUrl = (latitude: number, longitude: number) =>
  `${OSM_SITE_URL}#map=${LOCATION_MAP_ZOOM}/${latitude}/${longitude}`;

const LocationSection = ({ listing }: LocationSectionProps) => (
  <section id={SECTION_IDS.location} className="border-t border-hairline py-12">
    <h2 className="text-[22px] font-semibold text-ink">{t("listingDetail.location.title")}</h2>
    <div
      aria-label={t("listingDetail.location.mapTitle", { city: listing.city })}
      className="relative isolate mt-6 h-[320px] overflow-hidden rounded-xl bg-surface-muted md:h-[480px]"
    >
      <LocationMap latitude={listing.latitude} longitude={listing.longitude} />
    </div>
    <div className="mt-6 flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
      <div>
        <p className="text-base font-semibold text-ink">
          {t("listingDetail.location.place", {
            city: listing.city,
            state: listing.state,
            country: listing.country,
          })}
        </p>
        <p className="mt-1 text-base text-ink-muted">{t("listingDetail.location.exactLocationNote")}</p>
      </div>
      <a
        href={largerMapUrl(listing.latitude, listing.longitude)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink underline underline-offset-4"
      >
        {t("listingDetail.location.viewLargerMap")}
        <ExternalLink className="size-3.5" aria-hidden="true" />
      </a>
    </div>
  </section>
);

export default LocationSection;
