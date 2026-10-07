"use client";

import { Slider } from "@base-ui/react/slider";

import { t } from "@/common/i18n";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/utils/formatPrice";

import { PRICE_SLIDER_LARGE_STEP, PRICE_SLIDER_STEP } from "./constants";

type PriceRangeFilterProps = {
  bounds: [number, number];
  histogram: number[];
  value: [number, number];
  onChange: (value: [number, number]) => void;
};

type PricePillProps = {
  label: string;
  amount: string;
};

const PricePill = ({ label, amount }: PricePillProps) => (
  <div className="flex min-w-28 flex-col rounded-full border border-hairline px-6 py-2.5 text-center">
    <span className="text-xs text-ink-muted">{label}</span>
    <span className="text-base text-ink">{amount}</span>
  </div>
);

const PriceRangeFilter = ({ bounds, histogram, value, onChange }: PriceRangeFilterProps) => {
  const [lowerBound, upperBound] = bounds;
  const [selectedMin, selectedMax] = value;
  const tallestBar = Math.max(...histogram, 1);
  const bucketWidth = (upperBound - lowerBound) / Math.max(histogram.length, 1);
  const thumbLabels = [
    t("listings.filters.minimumPrice"),
    t("listings.filters.maximumPrice"),
  ];

  return (
    <div className="px-2">
      <div className="flex h-20 items-end gap-0.5" aria-hidden="true">
        {histogram.map((count, index) => {
          const bucketStart = lowerBound + index * bucketWidth;
          const bucketEnd = bucketStart + bucketWidth;
          const isInRange = bucketEnd >= selectedMin && bucketStart <= selectedMax;

          return (
            <div
              key={index}
              className={cn(
                "flex-1 rounded-t-sm transition-colors",
                isInRange ? "bg-brand" : "bg-hairline",
              )}
              style={{ height: count > 0 ? `${(count / tallestBar) * 100}%` : 0 }}
            />
          );
        })}
      </div>

      <Slider.Root
        value={value}
        min={lowerBound}
        max={upperBound}
        step={PRICE_SLIDER_STEP}
        largeStep={PRICE_SLIDER_LARGE_STEP}
        minStepsBetweenValues={1}
        onValueChange={next => onChange(next as [number, number])}
        thumbAlignment="center"
        className="w-full"
      >
        <Slider.Control className="relative flex h-7 w-full touch-none items-center select-none">
          <Slider.Track className="relative h-0.5 w-full rounded-full bg-hairline">
            <Slider.Indicator className="h-full rounded-full bg-ink" />
          </Slider.Track>
          {thumbLabels.map((label, index) => (
            <Slider.Thumb
              key={label}
              index={index}
              getAriaLabel={() => label}
              className="size-7 rounded-full border border-hairline bg-surface shadow-pill outline-none transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-ink"
            />
          ))}
        </Slider.Control>
      </Slider.Root>

      <div className="mt-6 flex items-center justify-between gap-4">
        <PricePill label={t("listings.filters.minimum")} amount={formatPrice(selectedMin)} />
        <PricePill
          label={t("listings.filters.maximum")}
          amount={
            selectedMax >= upperBound
              ? t("listings.filters.priceAndAbove", { price: formatPrice(selectedMax) })
              : formatPrice(selectedMax)
          }
        />
      </div>
    </div>
  );
};

export default PriceRangeFilter;
