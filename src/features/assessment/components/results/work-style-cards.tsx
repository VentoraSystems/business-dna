"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { WORK_STYLE_ICONS, type WorkStyleKey } from "./config";

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

interface WorkStyleCardsProps {
  workStyle: { key: WorkStyleKey; score: number }[];
}

export function WorkStyleCards({ workStyle }: WorkStyleCardsProps) {
  const t = useTranslations("assessment.results");

  return (
    <section>
      <h2 className="mb-1 text-2xl">{t("workStyle.sectionTitle")}</h2>
      <p className="mb-6 text-sm text-muted-foreground">{t("workStyle.sectionSubtitle")}</p>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {workStyle.map(({ key, score }) => {
          const Icon = WORK_STYLE_ICONS[key];
          return (
            <motion.div key={key} variants={itemVariants}>
              <Card className="h-full">
                <CardContent className="space-y-3 pt-6">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                      <Icon className="h-4 w-4" />
                    </div>
                    <p className="text-sm font-semibold">{t(`workStyle.dimensions.${key}.label`)}</p>
                  </div>
                  <Progress value={score} />
                  <p className="text-xs text-muted-foreground">
                    {t(`workStyle.dimensions.${key}.description`)}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
