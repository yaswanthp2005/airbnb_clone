"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { t } from "@/common/i18n";
import { useAuthGate } from "@/hooks/useRequireAuth";

type RequireAuthProps = {
  children: React.ReactNode;
};

const RequireAuth = ({ children }: RequireAuthProps) => {
  const { isAuthenticated, isBootstrapping } = useAuthGate();

  if (isBootstrapping) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col gap-3 p-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <p className="p-8 text-center text-sm text-muted-foreground">
        {t("auth.signInRequired")}
      </p>
    );
  }

  return children;
};

export default RequireAuth;
