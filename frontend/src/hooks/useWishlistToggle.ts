"use client";

import { useCallback } from "react";

import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useToggleWishlist } from "@/queries/wishlist";

/** Guests get the login modal first; the save then goes through once they're signed in. */
export const useWishlistToggle = () => {
  const requireAuth = useRequireAuth();
  const { mutate } = useToggleWishlist();

  return useCallback(
    (listingId: number, isWishlisted: boolean) =>
      requireAuth(() => mutate({ listingId, isWishlisted: !isWishlisted })),
    [mutate, requireAuth],
  );
};
