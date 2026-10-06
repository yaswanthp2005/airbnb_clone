"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { routes } from "@/constants/routes";
import type { ListingFilters } from "@/types/listing";
import { buildUrl } from "@/utils/buildUrl";

import { filtersFromSearchParams, filtersToQuery } from "../utils";

export const useListingFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters = useMemo(
    () => filtersFromSearchParams(searchParams),
    [searchParams],
  );

  const setFilters = useCallback(
    (nextFilters: ListingFilters) => {
      router.push(
        buildUrl({ path: routes.home, query: filtersToQuery(nextFilters) }),
        { scroll: false },
      );
    },
    [router],
  );

  return { filters, setFilters };
};
