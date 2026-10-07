/** OpenStreetMap's standard tile server (https://operations.osmfoundation.org/policies/tiles/). */
export const OSM_TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
export const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
export const OSM_MAX_ZOOM = 19;
export const OSM_SITE_URL = "https://www.openstreetmap.org/";

/** Roughly the centre of India, shown until listings load. */
export const DEFAULT_MAP_CENTER: [number, number] = [22.5, 79];
export const DEFAULT_MAP_ZOOM = 5;

/** Tailwind `lg`: the explore map sits beside the cards from here up and is skipped below. */
export const MAP_SPLIT_MEDIA_QUERY = "(min-width: 1024px)";
