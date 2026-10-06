import Link from "next/link";

import { t } from "@/common/i18n";
import { routes } from "@/constants/routes";

const StaysTab = () => (
  <Link
    href={routes.home}
    aria-current="page"
    className="relative px-4 py-3 text-base text-ink after:absolute after:inset-x-4 after:bottom-1 after:h-0.5 after:rounded-full after:bg-ink"
  >
    {t("nav.stays")}
  </Link>
);

export default StaysTab;
