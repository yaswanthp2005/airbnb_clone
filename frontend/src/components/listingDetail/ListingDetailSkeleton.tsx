import PageContainer from "@/components/layout/PageContainer";
import { Skeleton } from "@/components/ui/skeleton";

import { DETAIL_COLUMNS_CLASS_NAME } from "./constants";

const ListingDetailSkeleton = () => (
  <PageContainer width="narrow" className="pb-16 pt-6">
    <Skeleton className="h-8 w-2/3 bg-surface-muted" />
    <Skeleton className="mt-6 aspect-[4/3] w-full rounded-xl bg-surface-muted sm:aspect-[2/1]" />
    <div className={`mt-8 ${DETAIL_COLUMNS_CLASS_NAME}`}>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-6 w-1/2 bg-surface-muted" />
        <Skeleton className="h-4 w-1/3 bg-surface-muted" />
        <Skeleton className="mt-8 h-16 w-full bg-surface-muted" />
        <Skeleton className="mt-8 h-32 w-full bg-surface-muted" />
      </div>
      <Skeleton className="hidden h-[320px] rounded-xl bg-surface-muted lg:block" />
    </div>
  </PageContainer>
);

export default ListingDetailSkeleton;
