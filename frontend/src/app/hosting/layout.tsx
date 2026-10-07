import RequireAuth from "@/components/auth/RequireAuth";
import HostModeSync from "@/components/hosting/HostModeSync";

export default function HostingLayout({ children }: LayoutProps<"/hosting">) {
  return (
    <RequireAuth>
      <HostModeSync />
      {children}
    </RequireAuth>
  );
}
