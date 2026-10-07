"use client";

import { useQuery } from "@tanstack/react-query";

import { getDestinations } from "@/api/destinations";
import { queryKeys } from "@/constants/queryKeys";

export const useDestinations = () =>
  useQuery({
    queryKey: queryKeys.destinations.list(),
    queryFn: getDestinations,
  });
