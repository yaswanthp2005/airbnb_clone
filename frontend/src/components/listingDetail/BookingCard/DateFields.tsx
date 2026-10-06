import { t } from "@/common/i18n";
import { cn } from "@/lib/utils";

import { formatFieldDate, type StayDates } from "../utils";

type DateField = keyof StayDates;

type DateFieldsProps = StayDates & {
  activeField?: DateField | null;
  onFieldClick?: (field: DateField) => void;
  className?: string;
};

const FIELDS: { key: DateField; labelKey: string }[] = [
  { key: "checkIn", labelKey: "listingDetail.booking.checkIn" },
  { key: "checkOut", labelKey: "listingDetail.booking.checkOut" },
];

/** The CHECK-IN | CHECKOUT pair; buttons when `onFieldClick` is set, read-only otherwise. */
const DateFields = ({ activeField, onFieldClick, className, ...dates }: DateFieldsProps) => (
  <div className={cn("grid grid-cols-2", className)}>
    {FIELDS.map(({ key, labelKey }, index) => {
      const value = formatFieldDate(dates[key]);
      const content = (
        <>
          <span className="block text-[10px] font-extrabold uppercase tracking-wide text-ink">
            {t(labelKey)}
          </span>
          <span className={cn("block truncate text-sm", value ? "text-ink" : "text-ink-muted")}>
            {value ?? t("listingDetail.booking.addDate")}
          </span>
        </>
      );
      const fieldClassName = cn(
        "min-w-0 rounded-lg px-3 py-2.5 text-left",
        index === 0 ? "rounded-r-none" : "rounded-l-none border-l border-input",
        activeField === key && "relative rounded-lg border-l-0 ring-2 ring-ink",
      );

      return onFieldClick ? (
        <button
          key={key}
          type="button"
          onClick={() => onFieldClick(key)}
          aria-expanded={activeField != null}
          className={fieldClassName}
        >
          {content}
        </button>
      ) : (
        <div key={key} className={fieldClassName}>
          {content}
        </div>
      );
    })}
  </div>
);

export default DateFields;
