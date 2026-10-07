"use client";

import { Heart, Share } from "lucide-react";
import { toast } from "sonner";

import { t } from "@/common/i18n";
import { useWishlistToggle } from "@/hooks/useWishlistToggle";
import { cn } from "@/lib/utils";

import { PHOTO_OVERLAY_BUTTON_CLASS_NAME } from "./constants";

type ListingActionsProps = {
  listingId: number;
  title: string;
  isWishlisted: boolean;
  /** `overlay`: round icon buttons over photos (mobile carousel). */
  variant?: "inline" | "overlay";
  className?: string;
};

const ACTION_CLASS_NAMES = {
  inline:
    "flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold text-ink underline underline-offset-2 transition-colors hover:bg-surface-muted",
  overlay: PHOTO_OVERLAY_BUTTON_CLASS_NAME,
};

const ListingActions = ({
  listingId,
  title,
  isWishlisted,
  variant = "inline",
  className,
}: ListingActionsProps) => {
  const actionClassName = ACTION_CLASS_NAMES[variant];
  const isOverlay = variant === "overlay";
  const toggleWishlist = useWishlistToggle();

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // Closing the native share sheet rejects; nothing to do.
      }
      return;
    }
    await navigator.clipboard.writeText(url);
    toast.success(t("listingDetail.linkCopied"));
  };


  return (
    <div className={cn("flex shrink-0 items-center", isOverlay ? "gap-3" : "gap-1", className)}>
      <button
        type="button"
        onClick={handleShare}
        aria-label={isOverlay ? t("listingDetail.share") : undefined}
        className={actionClassName}
      >
        <Share className="size-4" aria-hidden="true" />
        {isOverlay ? null : t("listingDetail.share")}
      </button>
      <button
        type="button"
        onClick={() => toggleWishlist(listingId, isWishlisted)}
        aria-pressed={isWishlisted}
        aria-label={isOverlay ? t(isWishlisted ? "listingDetail.saved" : "listingDetail.save") : undefined}
        className={actionClassName}
      >
        <Heart
          className={cn("size-4", isWishlisted && "fill-brand stroke-brand")}
          aria-hidden="true"
        />
        {isOverlay ? null : t(isWishlisted ? "listingDetail.saved" : "listingDetail.save")}
      </button>
    </div>
  );
};

export default ListingActions;
