"use client";

import { useEffect } from "react";

import { hostModeFlag } from "@/utils/storedFlag";

/** Opening any hosting page (also via a link or the address bar) switches to host mode. */
const HostModeSync = () => {
  useEffect(() => {
    hostModeFlag.set(true);
  }, []);

  return null;
};

export default HostModeSync;
