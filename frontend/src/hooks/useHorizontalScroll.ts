"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const EDGE_TOLERANCE_PX = 2;

/** Edge state + arrow scrolling for a horizontal scroller; `stepPx` defaults to one visible page. */
export const useHorizontalScroll = <T extends HTMLElement>(stepPx?: number) => {
  const ref = useRef<T>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateEdges = useCallback(() => {
    const node = ref.current;
    if (!node) return;
    setCanScrollLeft(node.scrollLeft > EDGE_TOLERANCE_PX);
    setCanScrollRight(
      node.scrollLeft + node.clientWidth < node.scrollWidth - EDGE_TOLERANCE_PX,
    );
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    updateEdges();
    node.addEventListener("scroll", updateEdges, { passive: true });
    const observer = new ResizeObserver(updateEdges);
    observer.observe(node);
    // Items loading in later change the scroll width without resizing the scroller itself.
    const mutationObserver = new MutationObserver(updateEdges);
    mutationObserver.observe(node, { childList: true });

    return () => {
      node.removeEventListener("scroll", updateEdges);
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [updateEdges]);

  const scrollByStep = useCallback(
    (direction: "left" | "right") => {
      const node = ref.current;
      if (!node) return;
      const step = stepPx ?? node.clientWidth;
      node.scrollBy({ left: direction === "left" ? -step : step, behavior: "smooth" });
    },
    [stepPx],
  );

  return { ref, canScrollLeft, canScrollRight, scrollByStep };
};
