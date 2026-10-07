import { LayoutGrid } from "lucide-react";

import { t } from "@/common/i18n";
import RemoteImage from "@/components/common/RemoteImage";
import { cn } from "@/lib/utils";

import {
  PHOTO_GRID_COUNT,
  PHOTO_GRID_SIZES,
  PHOTO_GRID_SMALL_SIZES,
  SECTION_IDS,
} from "./constants";

type PhotoGridProps = {
  photos: string[];
  onOpen: (index: number) => void;
};

const PhotoGrid = ({ photos, onOpen }: PhotoGridProps) => {
  const gridPhotos = photos.slice(0, PHOTO_GRID_COUNT);
  const isMosaic = gridPhotos.length === PHOTO_GRID_COUNT;

  return (
    <div id={SECTION_IDS.photos} className="relative mt-6">
      <div
        className={cn(
          "grid aspect-[4/3] overflow-hidden rounded-xl bg-surface-muted sm:aspect-[2/1]",
          isMosaic && "md:grid-cols-4 md:grid-rows-2 md:gap-2",
        )}
      >
        {gridPhotos.map((url, index) => {
          const isHero = index === 0;
          return (
            <button
              key={`${url}-${index}`}
              type="button"
              onClick={() => onOpen(index)}
              aria-label={t("listingDetail.photos.openPhoto", {
                index: index + 1,
                total: photos.length,
              })}
              className={cn(
                "relative overflow-hidden",
                isHero ? "md:col-span-2 md:row-span-2" : "hidden",
                !isHero && isMosaic && "md:block",
              )}
            >
              <RemoteImage
                src={url}
                alt=""
                fill
                sizes={isHero ? PHOTO_GRID_SIZES : PHOTO_GRID_SMALL_SIZES}
                loading={isHero ? "eager" : undefined}
                className="object-cover transition-[filter] duration-200 hover:brightness-90"
              />
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={() => onOpen(0)}
        className="absolute bottom-4 right-4 flex items-center gap-2 rounded-lg border border-ink bg-white px-4 py-1.5 text-sm font-semibold text-ink shadow-sm transition-colors hover:bg-surface-muted md:bottom-6 md:right-6"
      >
        <LayoutGrid className="size-4" aria-hidden="true" />
        {t("listingDetail.photos.showAll")}
      </button>
    </div>
  );
};

export default PhotoGrid;
