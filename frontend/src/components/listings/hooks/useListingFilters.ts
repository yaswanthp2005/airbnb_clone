"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { routes } from "@/constants/routes";
import type { ListingFilters } from "@/types/listing";
import { buildUrl } from "@/utils/buildUrl";

import { filtersFromSearchParams, filtersToQuery } from "../utils";

type SetFiltersOptions = {
  scrollToTop?: boolean;
};

export const useListingFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters = useMemo(
    () => filtersFromSearchParams(searchParams),
    [searchParams],
  );

  const setFilters = useCallback(
    (nextFilters: ListingFilters, { scrollToTop = false }: SetFiltersOptions = {}) => {
      router.push(
        buildUrl({ path: routes.home, query: filtersToQuery(nextFilters) }),
        { scroll: scrollToTop },
      );
    },
    [router],
  );

  return { filters, setFilters };
};
