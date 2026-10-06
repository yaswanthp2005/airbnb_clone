import Link from "next/link";
import { Globe } from "lucide-react";

import { t } from "@/common/i18n";
import PageContainer from "@/components/layout/PageContainer";

import { FOOTER_COLUMNS, FOOTER_LEGAL_LINKS } from "./constants";

const Footer = () => (
  <footer className="mt-auto border-t border-hairline bg-surface-muted text-ink">
    <PageContainer>
      <div className="grid gap-8 py-12 md:grid-cols-3">
        {FOOTER_COLUMNS.map(column => (
          <div key={column.titleKey} className="border-hairline not-last:border-b not-last:pb-8 md:not-last:border-b-0 md:not-last:pb-0">
            <h3 className="mb-3 text-sm font-semibold">{t(column.titleKey)}</h3>
            <ul className="space-y-3">
              {column.links.map(link => (
                <li key={link.labelKey}>
                  <Link href={link.href} className="text-sm hover:underline">
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex flex-col-reverse gap-4 border-t border-hairline py-6 text-sm md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span>{t("footer.copyright", { year: new Date().getFullYear() })}</span>
          {FOOTER_LEGAL_LINKS.map(link => (
            <span key={link.labelKey} className="flex items-center gap-2">
              <span aria-hidden="true">·</span>
              <Link href={link.href} className="hover:underline">
                {t(link.labelKey)}
              </Link>
            </span>
          ))}
        </div>

        <div className="flex items-center gap-6 font-semibold">
          <span className="flex items-center gap-2">
            <Globe className="size-4" aria-hidden="true" />
            {t("footer.language")}
          </span>
          <span>{t("footer.currency")}</span>
        </div>
      </div>
    </PageContainer>
  </footer>
);

export default Footer;
