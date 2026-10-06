import { t } from "@/common/i18n";
import { formatPrice } from "@/utils/formatPrice";
import type { PriceBreakdown } from "@/utils/pricing";

import { pluralize } from "../utils";

type PriceBreakdownListProps = {
  breakdown: PriceBreakdown;
};

const Row = ({ label, amount }: { label: string; amount: number }) => (
  <div className="flex items-center justify-between gap-4">
    <dt className="underline underline-offset-2">{label}</dt>
    <dd>{formatPrice(amount)}</dd>
  </div>
);

const PriceBreakdownList = ({ breakdown }: PriceBreakdownListProps) => (
  <dl className="mt-6 flex flex-col gap-3 text-base text-ink" aria-live="polite">
    <Row
      label={t("listingDetail.booking.nightlyLine", {
        price: formatPrice(breakdown.nightlyPrice),
        nights: pluralize(breakdown.nights, "listingDetail.availability.nights"),
      })}
      amount={breakdown.lodgingTotal}
    />
    {breakdown.cleaningFee > 0 ? (
      <Row label={t("listingDetail.booking.cleaningFee")} amount={breakdown.cleaningFee} />
    ) : null}
    <Row label={t("listingDetail.booking.serviceFee")} amount={breakdown.serviceFee} />
    <div className="mt-3 flex items-center justify-between gap-4 border-t border-hairline pt-6 font-semibold">
      <dt>{t("listingDetail.booking.totalBeforeTaxes")}</dt>
      <dd>{formatPrice(breakdown.total)}</dd>
    </div>
  </dl>
);

export default PriceBreakdownList;
