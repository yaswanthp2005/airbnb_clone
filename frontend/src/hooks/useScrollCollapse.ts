"use client";

import { useEffect, useState } from "react";

import { HEADER_COLLAPSE_AT_PX, HEADER_EXPAND_AT_PX } from "@/constants";

export const useScrollCollapse = (): boolean => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setIsCollapsed(previous => {
        if (!previous && y > HEADER_COLLAPSE_AT_PX) return true;
        if (previous && y < HEADER_EXPAND_AT_PX) return false;
        return previous;
      });
    };

    const onScroll = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return isCollapsed;
};
