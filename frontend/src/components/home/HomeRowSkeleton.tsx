import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import { ROW_SKELETON_COUNT } from "./constants";

type HomeRowSkeletonProps = {
  cardWidthClassName: string;
};

const HomeRowSkeleton = ({ cardWidthClassName }: HomeRowSkeletonProps) => (
  <div aria-hidden="true" className="flex flex-col gap-4">
    <Skeleton className="h-7 w-56 bg-surface-muted" />
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: ROW_SKELETON_COUNT }, (_, index) => (
        <div key={index} className={cn("flex shrink-0 flex-col gap-2", cardWidthClassName)}>
          <Skeleton className="aspect-[20/19] w-full rounded-2xl bg-surface-muted" />
          <Skeleton className="h-3.5 w-3/4 bg-surface-muted" />
          <Skeleton className="h-3.5 w-1/2 bg-surface-muted" />
        </div>
      ))}
    </div>
  </div>
);

export default HomeRowSkeleton;
