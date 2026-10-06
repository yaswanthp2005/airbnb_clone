"use client";

import { useEffect, useRef, useState } from "react";

type UseIntersectionObserverOptions = {
  onIntersect: () => void;
  enabled?: boolean;
  rootMargin?: string;
};

/** Returns a callback ref; `onIntersect` fires whenever the node enters the viewport. */
export const useIntersectionObserver = <T extends Element>({
  onIntersect,
  enabled = true,
  rootMargin,
}: UseIntersectionObserverOptions) => {
  const [node, setNode] = useState<T | null>(null);
  const onIntersectRef = useRef(onIntersect);

  useEffect(() => {
    onIntersectRef.current = onIntersect;
  }, [onIntersect]);

  useEffect(() => {
    if (!enabled || !node) {
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          onIntersectRef.current();
        }
      },
      { rootMargin },
    );
    observer.observe(node);

    return () => observer.disconnect();
  }, [node, enabled, rootMargin]);

  return setNode;
};
