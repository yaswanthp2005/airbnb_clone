import HostModeRedirect from "@/components/hosting/HostModeRedirect";
import HomeSections from "@/components/home";
import PageContainer from "@/components/layout/PageContainer";

export default function Home() {
  return (
    <PageContainer className="pb-16 pt-8">
      <HostModeRedirect />
      <HomeSections />
    </PageContainer>
  );
}
