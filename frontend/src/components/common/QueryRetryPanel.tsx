import { t } from "@/common/i18n";
import { STATUS_SECONDARY_ACTION_CLASS_NAME } from "@/components/common/StatusPage";

type QueryRetryPanelProps = {
  onRetry: () => void;
  className?: string;
};

/** Inline fetch error with retry (host lists, reservations, etc.). */
const QueryRetryPanel = ({ onRetry, className }: QueryRetryPanelProps) => (
  <div className={className ?? "flex flex-col items-start gap-4 py-10"}>
    <p className="text-base text-ink-muted">{t("common.somethingWentWrong")}</p>
    <button type="button" onClick={onRetry} className={STATUS_SECONDARY_ACTION_CLASS_NAME}>
      {t("hosting.retry")}
    </button>
  </div>
);

export default QueryRetryPanel;
