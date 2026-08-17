"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export type FaqItem = { title: string; content: string; html?: string };

export default function FAQAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-3xl divide-y divide-cream-deep overflow-hidden rounded-2xl border border-cream-deep bg-white">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-semibold text-slate">{item.title}</span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-coral-dark transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isOpen && (
              <div className="px-5 pb-5 text-sm leading-relaxed text-warm-gray">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
