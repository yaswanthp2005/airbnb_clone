"use client";

import type { MouseEvent } from "react";
import { Heart } from "lucide-react";

import { t } from "@/common/i18n";
import { useWishlistToggle } from "@/hooks/useWishlistToggle";
import { cn } from "@/lib/utils";

type WishlistButtonProps = {
  listingId: number;
  isWishlisted: boolean;
};

/** Heart over a card photo; sits above the card's overlay link. */
const WishlistButton = ({ listingId, isWishlisted }: WishlistButtonProps) => {
  const toggleWishlist = useWishlistToggle();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    toggleWishlist(listingId, isWishlisted);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={isWishlisted}
      aria-label={t(
        isWishlisted ? "listings.card.removeFromWishlist" : "listings.card.saveToWishlist",
      )}
      className="absolute right-3 top-3 z-20 transition-transform hover:scale-110"
    >
      <Heart
        className={cn(
          "size-6 stroke-on-photo stroke-2 drop-shadow-sm",
          isWishlisted ? "fill-brand" : "fill-photo-scrim/50",
        )}
        aria-hidden="true"
      />
    </button>
  );
};

export default WishlistButton;
