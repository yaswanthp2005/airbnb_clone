import { t } from "@/common/i18n";

type ShowMoreButtonProps = {
  label: string;
  isLoading: boolean;
  onClick: () => void;
};

const ShowMoreButton = ({ label, isLoading, onClick }: ShowMoreButtonProps) => (
  <div className="mt-10 flex justify-center">
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className="rounded-lg border border-ink px-6 py-3 text-base font-semibold text-ink transition-colors hover:bg-surface-muted disabled:opacity-40"
    >
      {isLoading ? t("common.loading") : label}
    </button>
  </div>
);

export default ShowMoreButton;
