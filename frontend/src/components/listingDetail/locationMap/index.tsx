"use client";

import dynamic from "next/dynamic";

import { Skeleton } from "@/components/ui/skeleton";

/** Leaflet touches `window`, so the map only ever renders in the browser. */
const LocationMap = dynamic(() => import("./LocationMap"), {
  ssr: false,
  loading: () => <Skeleton className="size-full rounded-none" />,
});

export default LocationMap;
