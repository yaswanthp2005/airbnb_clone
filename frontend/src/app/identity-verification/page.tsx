import { ShieldCheck } from "lucide-react";

import { t } from "@/common/i18n";
import ComingSoon from "@/components/common/ComingSoon";

export default function IdentityVerificationPage() {
  return (
    <ComingSoon
      title={t("comingSoon.identityTitle")}
      description={t("comingSoon.identityDescription")}
      icon={ShieldCheck}
    />
  );
}
