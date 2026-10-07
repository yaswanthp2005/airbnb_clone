"use client";

import { useState, type MouseEvent } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { t } from "@/common/i18n";
import RemoteImage from "@/components/common/RemoteImage";
import { LISTING_IMAGE_SIZES } from "@/constants";
import { useSnapCarousel } from "@/hooks/useSnapCarousel";
import { cn } from "@/lib/utils";

import { LISTING_LINK_TARGET_PROPS } from "../constants";

type PhotoCarouselProps = {
  photos: string[];
  alt: string;
  href: string;
  isEager?: boolean;
};

type ArrowButtonProps = {
  direction: "previous" | "next";
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
};

const ArrowButton = ({ direction, onClick }: ArrowButtonProps) => {
  const Icon = direction === "previous" ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={t(
        direction === "previous" ? "listings.card.previousPhoto" : "listings.card.nextPhoto",
      )}
      className={cn(
        "absolute top-1/2 z-20 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-surface-raised/90 text-ink opacity-0 shadow-pill transition hover:scale-105 hover:bg-surface-raised focus-visible:opacity-100 group-hover:opacity-100 pointer-coarse:hidden",
        direction === "previous" ? "left-3" : "right-3",
      )}
    >
      <Icon className="size-4" strokeWidth={2.5} aria-hidden="true" />
    </button>
  );
};

/** Swipeable on touch (scroll-snap), arrows on hover for mouse users. */
const PhotoCarousel = ({ photos, alt, href, isEager = false }: PhotoCarouselProps) => {
  const { ref, activeIndex, onScroll, scrollToIndex } = useSnapCarousel<HTMLAnchorElement>();
  const [hasInteracted, setHasInteracted] = useState(false);
  const lastIndex = photos.length - 1;

  const step = (delta: number) => (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    scrollToIndex(Math.min(Math.max(activeIndex + delta, 0), lastIndex));
  };

  // Preload the next photo once the user shows intent, so sliding never flashes blank.
  const shouldLoadEagerly = (index: number) =>
    index === 0 ? isEager : hasInteracted && index <= activeIndex + 1;

  return (
    <div
      className="relative aspect-square w-full overflow-hidden rounded-xl bg-surface-muted"
      onPointerEnter={() => setHasInteracted(true)}
    >
      {/* Sits above the card's overlay link so swipes reach the scroller; taps still navigate. */}
      <Link
        ref={ref}
        href={href}
        {...LISTING_LINK_TARGET_PROPS}
        onScroll={onScroll}
        tabIndex={-1}
        aria-hidden="true"
        draggable={false}
        className="scrollbar-none relative z-10 flex h-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
      >
        {photos.map((url, index) => (
          <div key={url} className="relative h-full w-full shrink-0 snap-center snap-always">
            <RemoteImage
              src={url}
              alt={t("listings.card.photoAlt", {
                title: alt,
                current: index + 1,
                total: photos.length,
              })}
              fill
              sizes={LISTING_IMAGE_SIZES}
              loading={shouldLoadEagerly(index) ? "eager" : "lazy"}
              draggable={false}
              className="object-cover"
            />
          </div>
        ))}
      </Link>

      {activeIndex > 0 ? <ArrowButton direction="previous" onClick={step(-1)} /> : null}
      {activeIndex < lastIndex ? <ArrowButton direction="next" onClick={step(1)} /> : null}

      {photos.length > 1 ? (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-3 z-20 flex justify-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100 pointer-coarse:opacity-100"
          aria-hidden="true"
        >
          {photos.map((url, index) => (
            <span
              key={url}
              className={cn(
                "size-1.5 rounded-full bg-on-photo transition-opacity",
                index === activeIndex ? "opacity-100" : "opacity-60",
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default PhotoCarousel;
