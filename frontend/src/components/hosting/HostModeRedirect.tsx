"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { routes } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { useHostMode } from "@/hooks/useHostMode";

/** Hosts who left in host mode land back on their dashboard, like Airbnb. */
const HostModeRedirect = () => {
  const router = useRouter();
  const { isAuthenticated, isBootstrapping } = useAuth();
  const isHostMode = useHostMode();
  const shouldRedirect = isHostMode && isAuthenticated && !isBootstrapping;

  useEffect(() => {
    if (shouldRedirect) {
      router.replace(routes.hosting);
    }
  }, [router, shouldRedirect]);

  return null;
};

export default HostModeRedirect;
