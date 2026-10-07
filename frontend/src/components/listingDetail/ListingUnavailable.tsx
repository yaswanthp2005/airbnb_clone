import Link from "next/link";
import { SearchX } from "lucide-react";

import { t } from "@/common/i18n";
import StatusPage, { STATUS_PRIMARY_ACTION_CLASS_NAME } from "@/components/common/StatusPage";
import { routes } from "@/constants/routes";

const ListingUnavailable = () => (
  <StatusPage
    icon={SearchX}
    title={t("listingDetail.unavailable.title")}
    description={t("listingDetail.unavailable.description")}
    actions={
      <Link href={routes.home} className={STATUS_PRIMARY_ACTION_CLASS_NAME}>
        {t("listingDetail.unavailable.backHome")}
      </Link>
    }
  />
);

export default ListingUnavailable;
