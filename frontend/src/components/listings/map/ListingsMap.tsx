"use client";

import { useEffect, useRef, useState } from "react";
import { latLngBounds, type Map as LeafletMap } from "leaflet";
import { MapContainer, useMap, ZoomControl } from "react-leaflet";

import OsmTileLayer from "@/components/map/OsmTileLayer";
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from "@/constants/map";
import type { ListingSummary } from "@/types/listing";

import { FIT_BOUNDS_MAX_ZOOM, FIT_BOUNDS_PADDING } from "./constants";
import PricePin from "./PricePin";

export type ListingsMapProps = {
  listings: ListingSummary[];
  /** Map is re-fitted when this changes (new search), not when more pages load. */
  resultsKey: string;
  hoveredListingId: number | null;
  listingHref: (listing: ListingSummary) => string;
};

type FitToResultsProps = Pick<ListingsMapProps, "listings" | "resultsKey">;

const FitToResults = ({ listings, resultsKey }: FitToResultsProps) => {
  const map = useMap();
  const fittedKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (listings.length === 0 || fittedKeyRef.current === resultsKey) {
      return;
    }
    // The first fit happens as the map appears, so there's nothing to animate from.
    const isFirstFit = fittedKeyRef.current === null;
    fittedKeyRef.current = resultsKey;
    map.fitBounds(
      latLngBounds(listings.map(listing => [listing.latitude, listing.longitude])),
      { padding: FIT_BOUNDS_PADDING, maxZoom: FIT_BOUNDS_MAX_ZOOM, animate: !isFirstFit },
    );
  }, [listings, map, resultsKey]);

  return null;
};

/** Container resizes (the split view opening, the window) need Leaflet to re-measure. */
const InvalidateOnResize = () => {
  const map = useMap();

  useEffect(() => {
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(map.getContainer());
    return () => observer.disconnect();
  }, [map]);

  return null;
};

/**
 * Leaflet 1.9 finishes a zoom animation on a 250ms timer that outlives `map.remove()` and then
 * throws on the removed pane, e.g. when leaving the results right after a refit.
 */
const FinishZoomOnUnload = () => {
  const map = useMap();

  useEffect(() => {
    const finishZoom = () => {
      (map as LeafletMap & { _animatingZoom: boolean })._animatingZoom = false;
    };
    map.on("unload", finishZoom);
    return () => {
      map.off("unload", finishZoom);
    };
  }, [map]);

  return null;
};

const ListingsMap = ({ listings, resultsKey, hoveredListingId, listingHref }: ListingsMapProps) => {
  const [selectedListingId, setSelectedListingId] = useState<number | null>(null);

  return (
    <MapContainer
      center={DEFAULT_MAP_CENTER}
      zoom={DEFAULT_MAP_ZOOM}
      zoomControl={false}
      className="size-full"
    >
      <OsmTileLayer />
      <ZoomControl position="topright" />
      <FitToResults listings={listings} resultsKey={resultsKey} />
      <InvalidateOnResize />
      <FinishZoomOnUnload />
      {listings.map(listing => (
        <PricePin
          key={listing.id}
          listing={listing}
          href={listingHref(listing)}
          isHighlighted={listing.id === hoveredListingId || listing.id === selectedListingId}
          onSelect={setSelectedListingId}
        />
      ))}
    </MapContainer>
  );
};

export default ListingsMap;
