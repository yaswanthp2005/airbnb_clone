import { t } from "@/common/i18n";
import { Skeleton } from "@/components/ui/skeleton";
import { DEFAULT_PAGE_SIZE } from "@/constants";

type ListingGridSkeletonProps = {
  count?: number;
};

const ListingGridSkeleton = ({ count = DEFAULT_PAGE_SIZE }: ListingGridSkeletonProps) => (
  <div
    role="status"
    aria-label={t("home.listingsLoading")}
    className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
  >
    {Array.from({ length: count }, (_, index) => (
      <div key={index} className="flex flex-col gap-3">
        <Skeleton className="aspect-square w-full rounded-xl bg-surface-muted" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-3/4 bg-surface-muted" />
          <Skeleton className="h-4 w-1/2 bg-surface-muted" />
          <Skeleton className="h-4 w-1/3 bg-surface-muted" />
        </div>
      </div>
    ))}
  </div>
);

export default ListingGridSkeleton;
