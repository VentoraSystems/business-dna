"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { CheckCircle2, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { GROWTH_OPPORTUNITY_IDS, STRENGTH_IDS } from "./config";

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -8 },
  show: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

interface StrengthsAndGrowthProps {
  strengths: (typeof STRENGTH_IDS)[number][];
  growthOpportunities: (typeof GROWTH_OPPORTUNITY_IDS)[number][];
}

export function StrengthsAndGrowth({ strengths, growthOpportunities }: StrengthsAndGrowthProps) {
  const t = useTranslations("assessment.results");

  return (
    <section className="grid gap-6 sm:grid-cols-2">
      <Card>
        <CardContent className="pt-6">
          <h2 className="mb-4 text-xl">{t("strengths.sectionTitle")}</h2>
          <motion.ul
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="space-y-3"
          >
            {strengths.map((id) => (
              <motion.li key={id} variants={itemVariants} className="flex items-start gap-2.5 text-sm">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <span>{t(`strengths.items.${id}`)}</span>
              </motion.li>
            ))}
          </motion.ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h2 className="mb-4 text-xl">{t("growth.sectionTitle")}</h2>
          <motion.ul
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="space-y-3"
          >
            {growthOpportunities.map((id) => (
              <motion.li key={id} variants={itemVariants} className="flex items-start gap-2.5 text-sm">
                <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-accent-foreground" />
                <span>{t(`growth.items.${id}`)}</span>
              </motion.li>
            ))}
          </motion.ul>
        </CardContent>
      </Card>
    </section>
  );
}
