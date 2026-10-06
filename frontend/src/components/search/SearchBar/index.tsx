"use client";

import { useListingFilters } from "@/components/listings/hooks/useListingFilters";

import type { SearchSection } from "../constants";
import { draftFromFilters, draftToFilters, type SearchDraft } from "../utils";
import SearchForm from "./SearchForm";

type SearchBarProps = {
  activeSection: SearchSection | null;
  onActiveSectionChange: (section: SearchSection | null) => void;
};

const SearchBar = ({ activeSection, onActiveSectionChange }: SearchBarProps) => {
  const { filters, setFilters } = useListingFilters();
  const initialDraft = draftFromFilters(filters);

  const handleSubmit = (draft: SearchDraft) =>
    setFilters({ ...filters, ...draftToFilters(draft) }, { scrollToTop: true });

  return (
    <SearchForm
      // Remount with fresh draft state whenever the URL's search values change (e.g. back/forward).
      key={JSON.stringify(initialDraft)}
      initialDraft={initialDraft}
      activeSection={activeSection}
      onActiveSectionChange={onActiveSectionChange}
      onSubmit={handleSubmit}
    />
  );
};

export default SearchBar;
