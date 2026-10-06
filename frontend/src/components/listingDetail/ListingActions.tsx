"use client";

import { Heart, Share } from "lucide-react";
import { toast } from "sonner";

import { t } from "@/common/i18n";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { runProtectedAction } from "@/utils/protectedAction";

type ListingActionsProps = {
  title: string;
  isWishlisted: boolean;
  className?: string;
};

const actionClassName =
  "flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold text-ink underline underline-offset-2 transition-colors hover:bg-surface-muted";

const ListingActions = ({ title, isWishlisted, className }: ListingActionsProps) => {
  const { isAuthenticated, openAuthModal } = useAuth();

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

  const handleSave = () =>
    // Wishlist toggling lands with the wishlists feature; for now only gate on auth.
    runProtectedAction(() => undefined, { isAuthenticated, openAuthModal });

  return (
    <div className={cn("flex shrink-0 items-center gap-1", className)}>
      <button type="button" onClick={handleShare} className={actionClassName}>
        <Share className="size-4" aria-hidden="true" />
        {t("listingDetail.share")}
      </button>
      <button
        type="button"
        onClick={handleSave}
        aria-pressed={isWishlisted}
        className={actionClassName}
      >
        <Heart
          className={cn("size-4", isWishlisted && "fill-brand stroke-brand")}
          aria-hidden="true"
        />
        {t(isWishlisted ? "listingDetail.saved" : "listingDetail.save")}
      </button>
    </div>
  );
};

export default ListingActions;
