"use client";

import "leaflet/dist/leaflet.css";
import "./map.css";

import { TileLayer } from "react-leaflet";

import { OSM_ATTRIBUTION, OSM_MAX_ZOOM, OSM_TILE_URL } from "@/constants/map";

/** Every map uses this, so it also pulls in Leaflet's CSS and our overrides. */
const OsmTileLayer = () => (
  <TileLayer url={OSM_TILE_URL} attribution={OSM_ATTRIBUTION} maxZoom={OSM_MAX_ZOOM} />
);

export default OsmTileLayer;
