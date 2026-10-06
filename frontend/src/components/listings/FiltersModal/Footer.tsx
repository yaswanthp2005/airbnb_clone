import { Loader2 } from "lucide-react";

import { t } from "@/common/i18n";

type FooterProps = {
  resultCount?: number;
  isCounting: boolean;
  canClear: boolean;
  onClear: () => void;
  onApply: () => void;
};

const COUNT_LOCALE = "en-IN";

const showStaysLabel = (resultCount?: number): string => {
  if (resultCount === undefined) {
    return t("listings.filters.showStays");
  }
  if (resultCount === 1) {
    return t("listings.filters.showStaysOne");
  }
  return t("listings.filters.showStaysOther", {
    count: resultCount.toLocaleString(COUNT_LOCALE),
  });
};

const Footer = ({ resultCount, isCounting, canClear, onClear, onApply }: FooterProps) => (
  <div className="flex items-center justify-between border-t border-hairline px-6 py-4">
    <button
      type="button"
      onClick={onClear}
      disabled={!canClear}
      className="-mx-2 rounded-lg px-2 py-2.5 text-base font-semibold text-ink underline underline-offset-2 transition-colors hover:bg-surface-muted disabled:cursor-not-allowed disabled:text-hairline disabled:no-underline disabled:hover:bg-transparent"
    >
      {t("listings.filters.clearAll")}
    </button>
    <button
      type="button"
      onClick={onApply}
      className="flex min-w-36 items-center justify-center gap-2 rounded-lg bg-ink px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-black"
    >
      {isCounting ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
      {showStaysLabel(resultCount)}
    </button>
  </div>
);

export default Footer;
