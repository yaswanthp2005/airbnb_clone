import { MessageSquare } from "lucide-react";

import { t } from "@/common/i18n";
import ComingSoon from "@/components/common/ComingSoon";

export default function MessagesPage() {
  return (
    <ComingSoon
      title={t("comingSoon.messagesTitle")}
      description={t("comingSoon.messagesDescription")}
      icon={MessageSquare}
    />
  );
}
