import Link from "next/link";
import { MapPinOff } from "lucide-react";

import { t } from "@/common/i18n";
import StatusPage, { STATUS_PRIMARY_ACTION_CLASS_NAME } from "@/components/common/StatusPage";
import { routes } from "@/constants/routes";

export default function NotFound() {
  return (
    <StatusPage
      icon={MapPinOff}
      eyebrow={t("notFoundPage.eyebrow")}
      title={t("notFoundPage.title")}
      description={t("notFoundPage.description")}
      actions={
        <Link href={routes.home} className={STATUS_PRIMARY_ACTION_CLASS_NAME}>
          {t("notFoundPage.backHome")}
        </Link>
      }
    />
  );
}
