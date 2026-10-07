import { t } from "@/common/i18n";

const GuestFavouriteBadge = () => (
  <span className="pointer-events-none absolute left-3 top-3 z-20 rounded-full bg-surface px-2.5 py-1 text-xs font-semibold text-ink shadow-card">
    {t("listings.card.guestFavourite")}
  </span>
);

export default GuestFavouriteBadge;
