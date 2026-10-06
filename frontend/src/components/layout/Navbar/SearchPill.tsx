import { Search } from "lucide-react";

import { t } from "@/common/i18n";

const Divider = () => <span aria-hidden="true" className="h-6 w-px bg-hairline" />;

const SearchPill = () => (
  <div
    role="search"
    className="flex h-12 items-center rounded-full border border-hairline bg-white shadow-pill transition-shadow hover:shadow-pill-hover"
  >
    <button type="button" className="truncate pl-6 pr-4 text-sm font-semibold text-ink">
      {t("search.anywhere")}
    </button>
    <Divider />
    <button type="button" className="truncate px-4 text-sm font-semibold text-ink">
      {t("search.anyWeek")}
    </button>
    <Divider />
    <button
      type="button"
      className="flex items-center gap-3 pl-4 pr-2 text-sm text-ink-muted"
    >
      <span className="truncate">{t("search.addGuests")}</span>
      <span className="flex size-8 items-center justify-center rounded-full bg-brand text-white">
        <Search className="size-3.5" strokeWidth={3} aria-hidden="true" />
        <span className="sr-only">{t("search.search")}</span>
      </span>
    </button>
  </div>
);

export default SearchPill;
