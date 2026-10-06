import { t } from "@/common/i18n";
import type { ListingDetail } from "@/types/listing";
import { buildUrl } from "@/utils/buildUrl";

import {
  MAP_BBOX_DELTA,
  MAP_COORDINATE_DECIMALS,
  MAP_LAYER,
  OSM_EMBED_URL,
  SECTION_IDS,
} from "./constants";

type LocationSectionProps = {
  listing: Pick<ListingDetail, "city" | "state" | "country" | "latitude" | "longitude">;
};

const toCoordinate = (value: number) => value.toFixed(MAP_COORDINATE_DECIMALS);

const mapEmbedUrl = (latitude: number, longitude: number) =>
  buildUrl({
    path: OSM_EMBED_URL,
    query: {
      bbox: [
        longitude - MAP_BBOX_DELTA,
        latitude - MAP_BBOX_DELTA,
        longitude + MAP_BBOX_DELTA,
        latitude + MAP_BBOX_DELTA,
      ].map(toCoordinate),
      layer: MAP_LAYER,
      marker: [latitude, longitude].map(toCoordinate),
    },
  });

const LocationSection = ({ listing }: LocationSectionProps) => (
  <section id={SECTION_IDS.location} className="border-t border-hairline py-12">
    <h2 className="text-[22px] font-semibold text-ink">{t("listingDetail.location.title")}</h2>
    <div className="mt-6 h-[320px] overflow-hidden rounded-xl bg-surface-muted md:h-[480px]">
      <iframe
        title={t("listingDetail.location.mapTitle", { city: listing.city })}
        src={mapEmbedUrl(listing.latitude, listing.longitude)}
        loading="lazy"
        className="size-full border-0"
      />
    </div>
    <p className="mt-6 text-base font-semibold text-ink">
      {t("listingDetail.location.place", {
        city: listing.city,
        state: listing.state,
        country: listing.country,
      })}
    </p>
    <p className="mt-1 text-base text-ink-muted">{t("listingDetail.location.exactLocationNote")}</p>
  </section>
);

export default LocationSection;
