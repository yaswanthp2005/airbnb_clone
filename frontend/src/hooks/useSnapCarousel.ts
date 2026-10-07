"use client";

import { useCallback, useRef, useState } from "react";

/**
 * State for a horizontal CSS scroll-snap carousel (one slide per viewport width): swiping is
 * native scrolling; buttons call `scrollToIndex`. Spread `ref` + `onScroll` on the scroller.
 */
export const useSnapCarousel = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const onScroll = useCallback(() => {
    const node = ref.current;
    if (node?.clientWidth) {
      setActiveIndex(Math.round(node.scrollLeft / node.clientWidth));
    }
  }, []);

  const scrollToIndex = useCallback((index: number) => {
    const node = ref.current;
    node?.scrollTo({ left: index * node.clientWidth, behavior: "smooth" });
  }, []);

  return { ref, activeIndex, onScroll, scrollToIndex };
};
