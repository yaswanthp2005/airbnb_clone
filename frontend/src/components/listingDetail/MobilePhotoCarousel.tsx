"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { t } from "@/common/i18n";
import RemoteImage from "@/components/common/RemoteImage";
import { routes } from "@/constants/routes";
import { useSnapCarousel } from "@/hooks/useSnapCarousel";

import { MOBILE_PHOTO_SIZES, PHOTO_OVERLAY_BUTTON_CLASS_NAME } from "./constants";
import ListingActions from "./ListingActions";

type MobilePhotoCarouselProps = {
  listingId: number;
  title: string;
  photos: string[];
  isWishlisted: boolean;
  onOpen: (index: number) => void;
};

/** Phone-only, edge-to-edge swipeable photos with back / share / save on top. */
const MobilePhotoCarousel = ({
  listingId,
  title,
  photos,
  isWishlisted,
  onOpen,
}: MobilePhotoCarouselProps) => {
  const router = useRouter();
  const { ref, activeIndex, onScroll } = useSnapCarousel<HTMLDivElement>();

  const goBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(routes.home);
    }
  };

  return (
    <div className="relative -mx-6 md:hidden">
      <div
        ref={ref}
        onScroll={onScroll}
        aria-roledescription={t("listingDetail.photos.carousel")}
        className="scrollbar-none flex aspect-[4/3] snap-x snap-mandatory overflow-x-auto overscroll-x-contain bg-surface-muted"
      >
        {photos.map((url, index) => (
          <button
            key={`${url}-${index}`}
            type="button"
            onClick={() => onOpen(index)}
            aria-label={t("listingDetail.photos.openPhoto", { index: index + 1, total: photos.length })}
            className="relative h-full w-full shrink-0 snap-center snap-always"
          >
            <RemoteImage
              src={url}
              alt=""
              fill
              sizes={MOBILE_PHOTO_SIZES}
              loading={index === 0 ? "eager" : "lazy"}
              draggable={false}
              className="object-cover"
            />
          </button>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-4 pt-[calc(1rem+env(safe-area-inset-top))] *:pointer-events-auto">
        <button type="button" onClick={goBack} aria-label={t("listingDetail.back")} className={PHOTO_OVERLAY_BUTTON_CLASS_NAME}>
          <ChevronLeft className="size-5" aria-hidden="true" />
        </button>
        <ListingActions listingId={listingId} title={title} isWishlisted={isWishlisted} variant="overlay" />
      </div>

      {photos.length > 1 ? (
        <span
          aria-live="polite"
          className="absolute bottom-4 right-4 rounded-md bg-photo-scrim/60 px-2.5 py-1 text-xs font-semibold text-on-photo"
        >
          {t("listingDetail.photos.counter", { current: activeIndex + 1, total: photos.length })}
        </span>
      ) : null}
    </div>
  );
};

export default MobilePhotoCarousel;
