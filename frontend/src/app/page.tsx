import PageContainer from "@/components/layout/PageContainer";
import ListingGridSkeleton from "@/components/listings/ListingGridSkeleton";

export default function Home() {
  return (
    <PageContainer className="pb-16 pt-6">
      <ListingGridSkeleton />
    </PageContainer>
  );
}
