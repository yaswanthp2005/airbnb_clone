"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";

import { t } from "@/common/i18n";
import PageContainer from "@/components/layout/PageContainer";
import { firstName } from "@/components/listingDetail/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { routes } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import type { HostListing } from "@/types/host";

import {
  DEFAULT_HOSTING_TAB,
  HOSTING_TAB_PARAM,
  HOSTING_TABS,
  type HostingTab,
} from "./constants";
import DeleteListingDialog from "./DeleteListingDialog";
import HostListingsList from "./HostListingsList";
import HostStats from "./HostStats";
import ReservationsList from "./ReservationsList";

const isHostingTab = (value: string | null): value is HostingTab =>
  HOSTING_TABS.some(tab => tab === value);

const HostingDashboard = () => {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get(HOSTING_TAB_PARAM);
  const tab = isHostingTab(tabParam) ? tabParam : DEFAULT_HOSTING_TAB;
  const [listingToDelete, setListingToDelete] = useState<HostListing | null>(null);

  const handleTabChange = (value: HostingTab) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === DEFAULT_HOSTING_TAB) {
      params.delete(HOSTING_TAB_PARAM);
    } else {
      params.set(HOSTING_TAB_PARAM, value);
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return (
    <PageContainer className="pb-16 pt-8 md:pt-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[32px] font-semibold leading-tight text-ink">
            {t("hosting.welcome", { name: user ? firstName(user.name) : "" })}
          </h1>
          <p className="mt-1 text-base text-ink-muted">{t("hosting.subtitle")}</p>
        </div>
        <Link
          href={routes.hostingNewListing}
          className="inline-flex items-center gap-2 self-start rounded-lg bg-ink px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 sm:self-auto"
        >
          <Plus className="size-4" aria-hidden="true" />
          {t("hosting.createListing")}
        </Link>
      </div>

      <div className="mt-8">
        <HostStats />
      </div>

      <Tabs
        value={tab}
        onValueChange={value => handleTabChange(value as HostingTab)}
        className="mt-10 gap-8"
      >
        <TabsList variant="line" className="h-auto! gap-6 border-b border-hairline p-0">
          {HOSTING_TABS.map(value => (
            <TabsTrigger
              key={value}
              value={value}
              className="flex-none px-0 pb-3 text-base font-medium text-ink-muted data-active:text-ink"
            >
              {t(`hosting.tabs.${value}`)}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="listings">
          <HostListingsList onDelete={setListingToDelete} />
        </TabsContent>
        <TabsContent value="reservations">
          <ReservationsList />
        </TabsContent>
      </Tabs>

      <DeleteListingDialog listing={listingToDelete} onClose={() => setListingToDelete(null)} />
    </PageContainer>
  );
};

export default HostingDashboard;
