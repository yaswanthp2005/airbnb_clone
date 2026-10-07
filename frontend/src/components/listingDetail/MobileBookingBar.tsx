import { t } from "@/common/i18n";
import { formatDateRange } from "@/components/search/utils";
import { formatPrice } from "@/utils/formatPrice";

import ReserveButton from "./BookingCard/ReserveButton";
import { SECTION_IDS } from "./constants";
import type { StayDates } from "./utils";

type MobileBookingBarProps = {
  pricePerNight: number;
  dates: StayDates;
  isBookable: boolean;
  onReserve: () => void;
};

const MobileBookingBar = ({ pricePerNight, dates, isBookable, onReserve }: MobileBookingBarProps) => (
  <div className="fixed inset-x-0 bottom-0 z-30 border-t border-hairline bg-surface shadow-bar md:hidden">
    <div className="flex items-center justify-between gap-4 px-6 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
      <div className="min-w-0">
        <p className="text-ink">
          <span className="font-semibold">{formatPrice(pricePerNight)}</span>{" "}
          {t("listingDetail.booking.perNight")}
        </p>
        <a
          href={`#${SECTION_IDS.availability}`}
          className="block truncate text-sm font-semibold text-ink underline underline-offset-2"
        >
          {formatDateRange(dates.checkIn, dates.checkOut) ??
            t("listingDetail.booking.addDatesForPrices")}
        </a>
      </div>
      <ReserveButton disabled={!isBookable} onClick={onReserve} className="shrink-0" />
    </div>
  </div>
);

export default MobileBookingBar;
