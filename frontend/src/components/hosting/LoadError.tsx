import { t } from "@/common/i18n";

type LoadErrorProps = {
  onRetry: () => void;
};

const LoadError = ({ onRetry }: LoadErrorProps) => (
  <div className="flex flex-col items-start gap-4 py-10">
    <p className="text-base text-ink-muted">{t("common.somethingWentWrong")}</p>
    <button
      type="button"
      onClick={onRetry}
      className="rounded-lg border border-ink px-5 py-2.5 text-sm font-semibold text-ink hover:bg-surface-muted"
    >
      {t("hosting.retry")}
    </button>
  </div>
);

export default LoadError;
