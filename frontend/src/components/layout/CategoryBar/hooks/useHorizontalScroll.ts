"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { CATEGORY_SCROLL_STEP_PX } from "@/constants";

const EDGE_TOLERANCE_PX = 2;

export const useHorizontalScroll = <T extends HTMLElement>() => {
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

    return () => {
      node.removeEventListener("scroll", updateEdges);
      observer.disconnect();
    };
  }, [updateEdges]);

  const scrollByStep = useCallback((direction: "left" | "right") => {
    ref.current?.scrollBy({
      left: direction === "left" ? -CATEGORY_SCROLL_STEP_PX : CATEGORY_SCROLL_STEP_PX,
      behavior: "smooth",
    });
  }, []);

  return { ref, canScrollLeft, canScrollRight, scrollByStep };
};
