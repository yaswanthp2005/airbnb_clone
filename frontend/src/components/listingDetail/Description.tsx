"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";

import { t } from "@/common/i18n";
import { useIsClamped } from "@/hooks/useIsClamped";

import DetailModal from "./DetailModal";

type DescriptionProps = {
  text: string;
};

/** Paragraphs are blank-line separated; a multi-line paragraph's first line is its heading. */
const toParagraphs = (text: string) =>
  text.split("\n\n").map(paragraph => {
    const [firstLine, ...rest] = paragraph.split("\n");
    return rest.length > 0
      ? { heading: firstLine, body: rest.join("\n") }
      : { heading: undefined, body: firstLine };
  });

const Description = ({ text }: DescriptionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { ref, isClamped } = useIsClamped<HTMLParagraphElement>();

  return (
    <section className="border-b border-hairline py-8">
      <p ref={ref} className="line-clamp-6 whitespace-pre-line text-base leading-6 text-ink">
        {text}
      </p>
      {isClamped ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="mt-4 flex items-center gap-1 text-base font-semibold text-ink underline underline-offset-2"
        >
          {t("listingDetail.description.showMore")}
          <ChevronRight className="size-4" aria-hidden="true" />
        </button>
      ) : null}

      <DetailModal
        open={isOpen}
        onOpenChange={setIsOpen}
        title={t("listingDetail.description.aboutThisSpace")}
      >
        <div className="flex flex-col gap-6 text-base leading-6 text-ink">
          {toParagraphs(text).map(({ heading, body }, index) => (
            <div key={index}>
              {heading ? <h3 className="mb-2 text-lg font-semibold">{heading}</h3> : null}
              <p className="whitespace-pre-line">{body}</p>
            </div>
          ))}
        </div>
      </DetailModal>
    </section>
  );
};

export default Description;
