import RequireAuth from "@/components/auth/RequireAuth";
import Trips from "@/components/trips";

export default function TripsPage() {
  return (
    <RequireAuth>
      <Trips />
    </RequireAuth>
  );
}
