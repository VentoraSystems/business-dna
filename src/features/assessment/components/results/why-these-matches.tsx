"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { WHY_MATCH_REASON_IDS } from "./config";

interface WhyTheseMatchesProps {
  reasons: (typeof WHY_MATCH_REASON_IDS)[number][];
}

export function WhyTheseMatches({ reasons }: WhyTheseMatchesProps) {
  const t = useTranslations("assessment.results");

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <Card>
        <CardContent className="space-y-4 pt-6">
          <h2 className="text-xl">{t("whyTheseMatches.sectionTitle")}</h2>
          <p className="text-sm text-muted-foreground">{t("whyTheseMatches.body")}</p>
          <ul className="space-y-2.5">
            {reasons.map((id) => (
              <li key={id} className="flex items-start gap-2.5 text-sm">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent-foreground" />
                <span>{t(`whyTheseMatches.reasons.${id}`)}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
}
