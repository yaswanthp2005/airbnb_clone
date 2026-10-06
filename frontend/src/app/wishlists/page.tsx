import RequireAuth from "@/components/auth/RequireAuth";
import Wishlists from "@/components/wishlists";

export default function WishlistsPage() {
  return (
    <RequireAuth>
      <Wishlists />
    </RequireAuth>
  );
}
