"use client";

import { useQuery } from "@tanstack/react-query";

import { getDestinations } from "@/api/destinations";
import { DESTINATIONS_STALE_TIME_MS } from "@/constants";
import { queryKeys } from "@/constants/queryKeys";

export const useDestinations = () =>
  useQuery({
    queryKey: queryKeys.destinations.list(),
    queryFn: getDestinations,
    staleTime: DESTINATIONS_STALE_TIME_MS,
  });
