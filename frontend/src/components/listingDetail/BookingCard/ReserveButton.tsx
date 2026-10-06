import { t } from "@/common/i18n";
import { cn } from "@/lib/utils";

type ReserveButtonProps = {
  disabled: boolean;
  onClick: () => void;
  className?: string;
  label?: string;
};

const ReserveButton = ({
  disabled,
  onClick,
  className,
  label = t("listingDetail.booking.reserve"),
}: ReserveButtonProps) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    className={cn(
      "h-12 rounded-lg bg-linear-to-r from-brand to-brand-dark px-6 text-base font-semibold text-white transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-40",
      className,
    )}
  >
    {label}
  </button>
);

export default ReserveButton;
