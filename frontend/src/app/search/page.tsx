import { Suspense } from "react";

import HostModeRedirect from "@/components/hosting/HostModeRedirect";
import PageContainer from "@/components/layout/PageContainer";
import ListingGridSkeleton from "@/components/listings/ListingGridSkeleton";
import ListingsFeed from "@/components/listings/ListingsFeed";
import { LISTING_MAP_GRID_CLASS_NAME } from "@/components/listings/constants";

export default function SearchPage() {
  return (
    <PageContainer className="pb-16 pt-6">
      <HostModeRedirect />
      <Suspense fallback={<ListingGridSkeleton className={LISTING_MAP_GRID_CLASS_NAME} />}>
        <ListingsFeed />
      </Suspense>
    </PageContainer>
  );
}
