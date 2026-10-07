"use client";

import { useState } from "react";

import { t } from "@/common/i18n";
import PageContainer from "@/components/layout/PageContainer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Booking, BookingTab } from "@/types/booking";

import CancelTripDialog from "./CancelTripDialog";
import { DEFAULT_TRIP_TAB, TRIP_TABS } from "./constants";
import ReviewDialog from "./ReviewDialog";
import TripsList from "./TripsList";

const Trips = () => {
  const [tab, setTab] = useState<BookingTab>(DEFAULT_TRIP_TAB);
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const [bookingToReview, setBookingToReview] = useState<Booking | null>(null);

  return (
    <PageContainer className="pb-16 pt-8 md:pt-12">
      <h1 className="text-[32px] font-semibold leading-tight text-ink">{t("trips.title")}</h1>
      <Tabs value={tab} onValueChange={value => setTab(value as BookingTab)} className="mt-6 gap-8">
        <TabsList variant="line" className="h-auto! gap-6 border-b border-hairline p-0">
          {TRIP_TABS.map(value => (
            <TabsTrigger
              key={value}
              value={value}
              className="flex-none px-0 pb-3 text-base font-medium text-ink-muted data-active:text-ink"
            >
              {t(`trips.tabs.${value}`)}
            </TabsTrigger>
          ))}
        </TabsList>
        {TRIP_TABS.map(value => (
          <TabsContent key={value} value={value}>
            <TripsList tab={value} onCancel={setBookingToCancel} onReview={setBookingToReview} />
          </TabsContent>
        ))}
      </Tabs>
      <CancelTripDialog booking={bookingToCancel} onClose={() => setBookingToCancel(null)} />
      <ReviewDialog booking={bookingToReview} onClose={() => setBookingToReview(null)} />
    </PageContainer>
  );
};

export default Trips;
