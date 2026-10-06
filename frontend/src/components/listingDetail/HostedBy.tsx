import { t } from "@/common/i18n";
import type { ListingHost } from "@/types/listing";

import UserAvatar from "./UserAvatar";
import { firstName, yearsHostingLabel } from "./utils";

type HostedByProps = {
  host: ListingHost;
};

const HostedBy = ({ host }: HostedByProps) => (
  <section className="flex items-center gap-6 border-y border-hairline py-6">
    <UserAvatar name={host.name} avatarUrl={host.avatarUrl} />
    <div className="flex flex-col">
      <p className="text-base font-semibold text-ink">
        {t("listingDetail.host.hostedBy", { name: firstName(host.name) })}
      </p>
      <p className="text-sm text-ink-muted">{yearsHostingLabel(host.joinedAt)}</p>
    </div>
  </section>
);

export default HostedBy;
