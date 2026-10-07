import Link from "next/link";

import { t } from "@/common/i18n";
import BeloIcon from "@/components/common/BeloIcon";
import { routes } from "@/constants/routes";

type LogoProps = {
  href?: string;
};

const Logo = ({ href = routes.home }: LogoProps) => (
  <Link
    href={href}
    aria-label={t("common.appName")}
    className="inline-flex items-center gap-1 text-brand"
  >
    <BeloIcon className="size-8" />
    <span className="hidden text-[22px] font-bold tracking-tight lg:inline">
      {t("common.brandName")}
    </span>
  </Link>
);

export default Logo;
