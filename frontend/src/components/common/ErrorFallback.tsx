"use client";

import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";

import { t } from "@/common/i18n";
import StatusPage, {
  STATUS_PRIMARY_ACTION_CLASS_NAME,
  STATUS_SECONDARY_ACTION_CLASS_NAME,
} from "@/components/common/StatusPage";
import { routes } from "@/constants/routes";

export type ErrorBoundaryProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

/** Shared body of `app/error.tsx` and `app/global-error.tsx`. */
const ErrorFallback = ({ error, retry }: ErrorBoundaryProps) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StatusPage
      icon={TriangleAlert}
      title={t("errorPage.title")}
      description={t("errorPage.description")}
      actions={
        <>
          <button type="button" onClick={retry} className={STATUS_PRIMARY_ACTION_CLASS_NAME}>
            {t("errorPage.retry")}
          </button>
          {/* Full reload on purpose: the app state that crashed shouldn't be reused. */}
          <a href={routes.home} className={STATUS_SECONDARY_ACTION_CLASS_NAME}>
            {t("errorPage.backHome")}
          </a>
        </>
      }
    />
  );
};

export default ErrorFallback;
