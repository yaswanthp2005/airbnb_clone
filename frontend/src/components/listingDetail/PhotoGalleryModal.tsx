"use client";

import { useCallback } from "react";
import { ChevronLeft } from "lucide-react";

import { t } from "@/common/i18n";
import RemoteImage from "@/components/common/RemoteImage";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import { GALLERY_PHOTO_SIZES, galleryPhotoId } from "./constants";
import ListingActions from "./ListingActions";

type PhotoGalleryModalProps = {
  listingId: number;
  title: string;
  photos: string[];
  isWishlisted: boolean;
  /** Photo to scroll to when opened; `null` keeps the gallery closed. */
  openIndex: number | null;
  onClose: () => void;
};

type GalleryPhotosProps = Pick<PhotoGalleryModalProps, "title" | "photos"> & {
  startIndex: number;
};

/** Every third photo spans the full width, the rest pair up — Airbnb's photo tour rhythm. */
const isWidePhoto = (index: number) => index % 3 === 0;

const GalleryPhotos = ({ title, photos, startIndex }: GalleryPhotosProps) => {
  const scrollIntoView = useCallback(
    (node: HTMLDivElement | null) => node?.scrollIntoView({ block: "center" }),
    [],
  );

  return (
    <div className="mx-auto grid max-w-3xl grid-cols-2 gap-2 px-6 pb-16 pt-2">
      {photos.map((url, index) => (
        <div
          key={`${url}-${index}`}
          id={galleryPhotoId(index)}
          ref={index === startIndex ? scrollIntoView : undefined}
          className={cn(
            "relative overflow-hidden bg-surface-muted",
            isWidePhoto(index) ? "col-span-2 aspect-[3/2]" : "aspect-square",
          )}
        >
          <RemoteImage
            src={url}
            alt={t("listingDetail.photos.alt", {
              title,
              index: index + 1,
              total: photos.length,
            })}
            fill
            sizes={GALLERY_PHOTO_SIZES}
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
};

const PhotoGalleryModal = ({
  listingId,
  title,
  photos,
  isWishlisted,
  openIndex,
  onClose,
}: PhotoGalleryModalProps) => (
  <Dialog open={openIndex !== null} onOpenChange={open => !open && onClose()}>
    <DialogContent
      showCloseButton={false}
      className="left-0 top-0 flex h-dvh w-screen max-w-none translate-x-0 translate-y-0 flex-col gap-0 rounded-none bg-white p-0 ring-0 sm:max-w-none data-open:zoom-in-100 data-closed:zoom-out-100"
    >
      <header className="flex h-16 shrink-0 items-center justify-between px-4 md:px-6">
        <DialogClose
          aria-label={t("listingDetail.back")}
          className="flex size-8 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface-muted"
        >
          <ChevronLeft className="size-5" aria-hidden="true" />
        </DialogClose>
        <DialogTitle className="sr-only">{t("listingDetail.photos.galleryTitle")}</DialogTitle>
        <ListingActions listingId={listingId} title={title} isWishlisted={isWishlisted} />
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {openIndex !== null ? (
          <GalleryPhotos title={title} photos={photos} startIndex={openIndex} />
        ) : null}
      </div>
    </DialogContent>
  </Dialog>
);

export default PhotoGalleryModal;
