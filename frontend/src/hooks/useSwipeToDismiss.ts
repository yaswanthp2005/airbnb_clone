"use client";

import { useRef, useState, type CSSProperties, type PointerEvent } from "react";

import { SWIPE_DISMISS_THRESHOLD_PX } from "@/constants";

/**
 * Drag-down-to-close for bottom sheets. Spread `handleProps` on the grab area (touch/pen only,
 * so desktop clicks are untouched) and `sheetStyle` on the sheet so it follows the finger.
 */
export const useSwipeToDismiss = (onDismiss: () => void) => {
  const [offset, setOffset] = useState(0);
  const startYRef = useRef<number | null>(null);

  const reset = () => {
    startYRef.current = null;
    setOffset(0);
  };

  const handleProps = {
    onPointerDown: (event: PointerEvent<HTMLElement>) => {
      // Pointer capture would retarget taps on controls inside the grab area (e.g. close).
      if (event.pointerType === "mouse" || (event.target as HTMLElement).closest("button, a")) {
        return;
      }
      startYRef.current = event.clientY;
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    onPointerMove: (event: PointerEvent<HTMLElement>) => {
      if (startYRef.current !== null) {
        setOffset(Math.max(0, event.clientY - startYRef.current));
      }
    },
    onPointerUp: () => {
      if (startYRef.current === null) {
        return;
      }
      if (offset > SWIPE_DISMISS_THRESHOLD_PX) {
        onDismiss();
      }
      reset();
    },
    onPointerCancel: reset,
  };

  const sheetStyle: CSSProperties | undefined = offset
    ? { transform: `translateY(${offset}px)`, transition: "none" }
    : undefined;

  return { handleProps, sheetStyle };
};
