"use client";

import { useEffect, useState } from "react";

/** Whether a line-clamped element is cutting off content; re-checked on resize. */
export const useIsClamped = <T extends HTMLElement>() => {
  const [node, setNode] = useState<T | null>(null);
  const [isClamped, setIsClamped] = useState(false);

  useEffect(() => {
    if (!node) {
      return;
    }
    const observer = new ResizeObserver(() =>
      setIsClamped(node.scrollHeight > node.clientHeight),
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [node]);

  return { ref: setNode, isClamped };
};
