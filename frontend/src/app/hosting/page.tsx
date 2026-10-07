import { Suspense } from "react";

import HostingDashboard from "@/components/hosting";

export default function HostingPage() {
  return (
    <Suspense>
      <HostingDashboard />
    </Suspense>
  );
}
