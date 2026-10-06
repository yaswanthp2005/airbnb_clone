import RequireAuth from "@/components/auth/RequireAuth";
import { t } from "@/common/i18n";

export default function TripsPage() {
  return (
    <RequireAuth>
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-semibold">{t("trips.title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("trips.empty")}</p>
      </div>
    </RequireAuth>
  );
}
