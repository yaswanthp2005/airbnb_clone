import { t } from "@/common/i18n";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type UserAvatarProps = {
  name: string;
  avatarUrl?: string | null;
  className?: string;
};

const UserAvatar = ({ name, avatarUrl, className }: UserAvatarProps) => (
  <Avatar className={cn("size-10", className)}>
    {avatarUrl ? (
      <AvatarImage src={avatarUrl} alt={t("listingDetail.host.avatarAlt", { name })} />
    ) : null}
    <AvatarFallback className="bg-ink font-semibold text-on-ink">
      {name.charAt(0).toUpperCase()}
    </AvatarFallback>
  </Avatar>
);

export default UserAvatar;
