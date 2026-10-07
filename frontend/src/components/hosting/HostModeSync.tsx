"use client";

import { useEffect } from "react";

import { setHostMode } from "@/utils/hostMode";

/** Opening any hosting page (also via a link or the address bar) switches to host mode. */
const HostModeSync = () => {
  useEffect(() => {
    setHostMode(true);
  }, []);

  return null;
};

export default HostModeSync;
