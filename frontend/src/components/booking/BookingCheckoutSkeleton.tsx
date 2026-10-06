import PageContainer from "@/components/layout/PageContainer";
import { DETAIL_COLUMNS_CLASS_NAME } from "@/components/listingDetail/constants";
import { Skeleton } from "@/components/ui/skeleton";

const BookingCheckoutSkeleton = () => (
  <PageContainer width="narrow" className="pb-16 pt-8">
    <Skeleton className="h-9 w-64" />
    <div className={`mt-10 ${DETAIL_COLUMNS_CLASS_NAME}`}>
      <div className="flex flex-col gap-6">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="mt-6 h-7 w-32" />
        <Skeleton className="h-36 w-full" />
      </div>
      <Skeleton className="mt-10 h-96 w-full rounded-xl lg:mt-0" />
    </div>
  </PageContainer>
);

export default BookingCheckoutSkeleton;
