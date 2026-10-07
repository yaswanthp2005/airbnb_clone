import { Suspense } from "react";

import HostModeRedirect from "@/components/hosting/HostModeRedirect";
import PageContainer from "@/components/layout/PageContainer";
import ListingGridSkeleton from "@/components/listings/ListingGridSkeleton";
import ListingsFeed from "@/components/listings/ListingsFeed";

export default function Home() {
  return (
    <PageContainer className="pb-16 pt-6">
      <HostModeRedirect />
      <Suspense fallback={<ListingGridSkeleton />}>
        <ListingsFeed />
      </Suspense>
    </PageContainer>
  );
}
