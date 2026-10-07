"use client";

import { useEffect, useState } from "react";

import { SCROLL_DIRECTION_THRESHOLD_PX } from "@/constants";

/** `true` while the user is scrolling down past `minScrollY`; flips back on any upward scroll. */
export const useIsScrollingDown = (minScrollY: number): boolean => {
  const [isScrollingDown, setIsScrollingDown] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - lastY;
      if (Math.abs(delta) < SCROLL_DIRECTION_THRESHOLD_PX) {
        return;
      }
      setIsScrollingDown(delta > 0 && y > minScrollY);
      lastY = y;
    };

    const onScroll = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [minScrollY]);

  return isScrollingDown;
};
