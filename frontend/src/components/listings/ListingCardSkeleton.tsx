import { Skeleton } from "@/components/ui/skeleton";

const ListingCardSkeleton = () => (
  <div className="flex flex-col gap-3" aria-hidden="true">
    <Skeleton className="aspect-square w-full rounded-xl bg-surface-muted" />
    <div className="flex flex-col gap-2">
      <Skeleton className="h-4 w-3/4 bg-surface-muted" />
      <Skeleton className="h-4 w-1/2 bg-surface-muted" />
      <Skeleton className="h-4 w-1/3 bg-surface-muted" />
    </div>
  </div>
);

export default ListingCardSkeleton;
