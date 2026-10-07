"use client";

import { divIcon } from "leaflet";
import { Circle, MapContainer, Marker } from "react-leaflet";

import OsmTileLayer from "@/components/map/OsmTileLayer";

import { LOCATION_MAP_ZOOM, LOCATION_RADIUS_METERS } from "../constants";

export type LocationMapProps = {
  latitude: number;
  longitude: number;
};

/** lucide `House`, inlined because Leaflet icons are HTML strings. */
const HOUSE_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>';

const homeIcon = divIcon({
  className: "",
  iconSize: [0, 0],
  html: `<span class="home-pin">${HOUSE_SVG}</span>`,
});

/** Non-interactive map: the guest only needs the neighbourhood, not to explore. */
const LocationMap = ({ latitude, longitude }: LocationMapProps) => (
  <MapContainer
    center={[latitude, longitude]}
    zoom={LOCATION_MAP_ZOOM}
    zoomControl={false}
    dragging={false}
    scrollWheelZoom={false}
    doubleClickZoom={false}
    touchZoom={false}
    boxZoom={false}
    keyboard={false}
    className="size-full"
  >
    <OsmTileLayer />
    <Circle
      center={[latitude, longitude]}
      radius={LOCATION_RADIUS_METERS}
      interactive={false}
      className="location-radius"
    />
    <Marker position={[latitude, longitude]} icon={homeIcon} interactive={false} keyboard={false} />
  </MapContainer>
);

export default LocationMap;
