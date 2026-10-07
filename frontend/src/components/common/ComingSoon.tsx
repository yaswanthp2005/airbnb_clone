import Link from "next/link";
import { Sparkles, type LucideIcon } from "lucide-react";

import { t } from "@/common/i18n";
import StatusPage, { STATUS_PRIMARY_ACTION_CLASS_NAME } from "@/components/common/StatusPage";
import { routes } from "@/constants/routes";

type ComingSoonProps = {
  title?: string;
  description?: string;
  icon?: LucideIcon;
};

const ComingSoon = ({
  title = t("comingSoon.title"),
  description = t("comingSoon.description"),
  icon = Sparkles,
}: ComingSoonProps) => (
  <StatusPage
    eyebrow={t("comingSoon.title")}
    title={title}
    description={description}
    icon={icon}
    actions={
      <Link href={routes.home} className={STATUS_PRIMARY_ACTION_CLASS_NAME}>
        {t("comingSoon.backHome")}
      </Link>
    }
  />
);

export default ComingSoon;
