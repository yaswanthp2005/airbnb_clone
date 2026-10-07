"use client";

import { useLayoutEffect, useRef, useState } from "react";

type HighlightBox = {
  left: number;
  width: number;
  isVisible: boolean;
  /** False when it appears from hidden, so it shows in place instead of sliding from its last spot. */
  canSlide: boolean;
};

const HIDDEN_BOX: HighlightBox = { left: 0, width: 0, isVisible: false, canSlide: false };

/**
 * Position of one highlight that slides under the active item. `elements` holds each item's
 * element by key; offsets are relative to their shared positioned parent.
 */
export const useSlidingHighlight = <Key extends string>(activeKey: Key | null) => {
  const elements = useRef<Partial<Record<Key, HTMLElement | null>>>({});
  const previousKey = useRef<Key | null>(null);
  const [box, setBox] = useState<HighlightBox>(HIDDEN_BOX);

  useLayoutEffect(() => {
    const canSlide = previousKey.current !== null;
    previousKey.current = activeKey;
    const element = activeKey ? elements.current[activeKey] : null;
    if (!element) {
      setBox(current => ({ ...current, isVisible: false, canSlide: false }));
      return;
    }

    const measure = (slide: boolean) =>
      setBox({ left: element.offsetLeft, width: element.offsetWidth, isVisible: true, canSlide: slide });
    measure(canSlide);
    const observer = new ResizeObserver(() => measure(true));
    observer.observe(element);
    return () => observer.disconnect();
  }, [activeKey]);

  const register = (key: Key) => (element: HTMLElement | null) => {
    elements.current[key] = element;
  };

  return { box, register };
};
