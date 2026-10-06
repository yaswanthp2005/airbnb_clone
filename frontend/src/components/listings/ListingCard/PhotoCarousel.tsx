"use client";

import { useState, type MouseEvent } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { t } from "@/common/i18n";
import { LISTING_IMAGE_SIZES } from "@/constants";
import { cn } from "@/lib/utils";

type PhotoCarouselProps = {
  photos: string[];
  alt: string;
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
        "absolute top-1/2 z-20 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink opacity-0 shadow-pill transition hover:scale-105 hover:bg-white focus-visible:opacity-100 group-hover:opacity-100",
        direction === "previous" ? "left-3" : "right-3",
      )}
    >
      <Icon className="size-4" strokeWidth={2.5} aria-hidden="true" />
    </button>
  );
};

const PhotoCarousel = ({ photos, alt, isEager = false }: PhotoCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const lastIndex = photos.length - 1;

  const step = (delta: number) => (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setActiveIndex(current => Math.min(Math.max(current + delta, 0), lastIndex));
  };

  // Preload the next photo once the user shows intent, so sliding never flashes blank.
  const shouldLoadEagerly = (index: number) =>
    index === 0 ? isEager : isHovered && index <= activeIndex + 1;

  return (
    <div
      className="relative aspect-square w-full overflow-hidden rounded-xl bg-surface-muted"
      onMouseEnter={() => setIsHovered(true)}
    >
      <div
        className="flex h-full transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {photos.map((url, index) => (
          <div key={url} className="relative h-full w-full shrink-0">
            <Image
              src={url}
              alt={t("listings.card.photoAlt", {
                title: alt,
                current: index + 1,
                total: photos.length,
              })}
              fill
              sizes={LISTING_IMAGE_SIZES}
              loading={shouldLoadEagerly(index) ? "eager" : "lazy"}
              className="object-cover"
              aria-hidden={index !== activeIndex}
            />
          </div>
        ))}
      </div>

      {activeIndex > 0 ? <ArrowButton direction="previous" onClick={step(-1)} /> : null}
      {activeIndex < lastIndex ? <ArrowButton direction="next" onClick={step(1)} /> : null}

      {photos.length > 1 ? (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-3 z-20 flex justify-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100"
          aria-hidden="true"
        >
          {photos.map((url, index) => (
            <span
              key={url}
              className={cn(
                "size-1.5 rounded-full bg-white transition-opacity",
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
