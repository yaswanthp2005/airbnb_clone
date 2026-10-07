"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { t } from "@/common/i18n";
import ThemeSegmentedControl from "@/components/common/theme/ThemeSegmentedControl";
import PageContainer from "@/components/layout/PageContainer";
import UserAvatar from "@/components/listingDetail/UserAvatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useRequireAuth } from "@/hooks/useRequireAuth";

import { PROFILE_LINKS, type ProfileLink } from "./constants";

const ROW_CLASS_NAME =
  "flex w-full items-center gap-4 border-b border-hairline py-4 text-left text-base text-ink transition-colors hover:text-ink-muted";

const ProfileHeader = () => {
  const { isAuthenticated, isBootstrapping, user, openAuthModal } = useAuth();

  if (isBootstrapping) {
    return <Skeleton className="h-20 w-full" />;
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-4 rounded-2xl bg-surface-raised p-5 shadow-card">
        <UserAvatar name={user.name} avatarUrl={user.avatarUrl} className="size-16 text-2xl" />
        <div className="min-w-0">
          <p className="truncate text-xl font-semibold text-ink">{user.name}</p>
          <p className="truncate text-sm text-ink-muted">{user.email}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-lg text-ink-muted">{t("profile.guestPrompt")}</p>
      <button
        type="button"
        onClick={() => openAuthModal("login")}
        className="rounded-lg bg-brand py-3.5 text-base font-semibold text-on-brand transition-colors hover:bg-brand-dark"
      >
        {t("nav.logIn")}
      </button>
      <p className="text-sm text-ink-muted">
        {t("profile.noAccount")}{" "}
        <button
          type="button"
          onClick={() => openAuthModal("register")}
          className="font-semibold text-ink underline underline-offset-2"
        >
          {t("nav.signUp")}
        </button>
      </p>
    </div>
  );
};

const Profile = () => {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();
  const requireAuth = useRequireAuth();
  const links = PROFILE_LINKS.filter(link => isAuthenticated || !link.membersOnly);

  const renderLink = ({ key, labelKey, route, icon: Icon, requiresAuth }: ProfileLink) => {
    const content = (
      <>
        <Icon className="size-6 shrink-0" strokeWidth={1.5} aria-hidden="true" />
        <span className="flex-1">{t(labelKey)}</span>
        <ChevronRight className="size-5 shrink-0 text-ink-muted" aria-hidden="true" />
      </>
    );
    return (
      <li key={key}>
        {requiresAuth && !isAuthenticated ? (
          <button type="button" onClick={() => requireAuth(() => router.push(route))} className={ROW_CLASS_NAME}>
            {content}
          </button>
        ) : (
          <Link href={route} className={ROW_CLASS_NAME}>
            {content}
          </Link>
        )}
      </li>
    );
  };

  return (
    <PageContainer className="max-w-2xl pb-12 pt-8">
      <h1 className="text-[32px] font-semibold text-ink">{t("profile.title")}</h1>
      <div className="mt-6">
        <ProfileHeader />
      </div>

      <section className="mt-10" aria-labelledby="profile-appearance">
        <h2 id="profile-appearance" className="mb-3 text-lg font-semibold text-ink">
          {t("theme.label")}
        </h2>
        <ThemeSegmentedControl />
      </section>

      <section className="mt-10" aria-labelledby="profile-settings">
        <h2 id="profile-settings" className="text-lg font-semibold text-ink">
          {t("profile.settings")}
        </h2>
        <ul>{links.map(renderLink)}</ul>
      </section>

      {isAuthenticated ? (
        <button
          type="button"
          onClick={logout}
          className="mt-8 text-base font-semibold text-ink underline underline-offset-2"
        >
          {t("nav.logOut")}
        </button>
      ) : null}
    </PageContainer>
  );
};

export default Profile;
