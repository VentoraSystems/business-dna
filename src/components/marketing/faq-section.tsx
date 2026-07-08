"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const faqKeys = ["q1", "q2", "q3", "q4"] as const;

export function FaqSection() {
  const t = useTranslations("marketing.faq");
  const [openKey, setOpenKey] = React.useState<string | null>("q1");

  return (
    <section id="faq" className="container py-20">
      <h2 className="text-center text-3xl">{t("title")}</h2>
      <div className="mx-auto mt-10 max-w-2xl divide-y divide-border">
        {faqKeys.map((key) => (
          <div key={key} className="py-4">
            <button
              type="button"
              onClick={() => setOpenKey(openKey === key ? null : key)}
              className="flex w-full items-center justify-between text-left text-sm font-semibold"
            >
              {t(`items.${key}.question` as "items.q1.question")}
              <ChevronDown
                className={cn("h-4 w-4 shrink-0 transition-transform", openKey === key && "rotate-180")}
              />
            </button>
            {openKey === key && (
              <p className="mt-2 text-sm text-muted-foreground">
                {t(`items.${key}.answer` as "items.q1.answer")}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
