"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { t } from "@/common/i18n";
import { useHorizontalScroll } from "@/hooks/useHorizontalScroll";
import { cn } from "@/lib/utils";

type HomeRowProps = {
  title: string;
  /** Makes the title a link (with an arrow), e.g. to the matching search results. */
  href?: string;
  children: ReactNode;
};

type PagerButtonProps = {
  direction: "left" | "right";
  isEnabled: boolean;
  onClick: () => void;
};

const PagerButton = ({ direction, isEnabled, onClick }: PagerButtonProps) => {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!isEnabled}
      aria-label={t(direction === "left" ? "home.previous" : "home.next")}
      className="flex size-8 items-center justify-center rounded-full bg-surface-muted text-ink transition-colors hover:bg-surface-strong disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-surface-muted"
    >
      <Icon className="size-4" strokeWidth={2.5} aria-hidden="true" />
    </button>
  );
};

/** A titled, horizontally scrolling row of cards with Airbnb-style pager buttons. */
const HomeRow = ({ title, href, children }: HomeRowProps) => {
  const { ref, canScrollLeft, canScrollRight, scrollByStep } =
    useHorizontalScroll<HTMLDivElement>();

  return (
    <section aria-label={title} className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-ink md:text-[22px]">
          {href ? (
            <Link href={href} className="group inline-flex items-center gap-2">
              {title}
              <span className="flex size-7 items-center justify-center rounded-full bg-surface-muted transition-colors group-hover:bg-surface-strong">
                <ChevronRight className="size-4" strokeWidth={2.5} aria-hidden="true" />
              </span>
            </Link>
          ) : (
            title
          )}
        </h2>
        <div
          className={cn(
            "hidden shrink-0 gap-2 md:flex",
            !canScrollLeft && !canScrollRight && "invisible",
          )}
        >
          <PagerButton direction="left" isEnabled={canScrollLeft} onClick={() => scrollByStep("left")} />
          <PagerButton direction="right" isEnabled={canScrollRight} onClick={() => scrollByStep("right")} />
        </div>
      </div>
      <div
        ref={ref}
        className="scrollbar-none flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain"
      >
        {children}
      </div>
    </section>
  );
};

export default HomeRow;
