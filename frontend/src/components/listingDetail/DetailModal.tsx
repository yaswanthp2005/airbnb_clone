"use client";

import { X } from "lucide-react";

import { t } from "@/common/i18n";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type DetailModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
};

const DetailModal = ({
  open,
  onOpenChange,
  title,
  children,
  className,
  footer,
}: DetailModalProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent
      showCloseButton={false}
      className={cn(
        "flex max-h-[calc(100dvh-4rem)] w-full flex-col gap-0 overflow-hidden rounded-xl bg-surface-raised p-0 shadow-card sm:max-w-[780px]",
        className,
      )}
    >
      <header className="flex h-16 shrink-0 items-center px-4">
        <DialogClose
          aria-label={t("listingDetail.close")}
          className="flex size-8 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface-muted"
        >
          <X className="size-4" strokeWidth={2.5} aria-hidden="true" />
        </DialogClose>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-10">
        <DialogTitle className="mb-6 text-[26px] font-semibold leading-8 text-ink">
          {title}
        </DialogTitle>
        {children}
      </div>
      {footer ? (
        <footer className="flex shrink-0 items-center justify-between gap-4 border-t border-hairline px-6 py-4">
          {footer}
        </footer>
      ) : null}
    </DialogContent>
  </Dialog>
);

export default DetailModal;
