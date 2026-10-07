import { t } from "@/common/i18n";

const DOT_DELAY_CLASS_NAMES = ["", "[animation-delay:150ms]", "[animation-delay:300ms]"];

/** Route-level loading state: three pulsing dots, like Airbnb's page loader. */
const PageLoader = () => (
  <div role="status" className="flex flex-1 items-center justify-center py-32">
    <span className="flex gap-1.5" aria-hidden="true">
      {DOT_DELAY_CLASS_NAMES.map(delay => (
        <span key={delay} className={`size-2 animate-pulse rounded-full bg-ink ${delay}`} />
      ))}
    </span>
    <span className="sr-only">{t("common.loading")}</span>
  </div>
);

export default PageLoader;
