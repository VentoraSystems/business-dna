"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DNA_ARCHETYPE_ICONS, type DnaArchetypeKey } from "./config";

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

interface DnaProfileCardsProps {
  profile: { key: DnaArchetypeKey; score: number }[];
}

export function DnaProfileCards({ profile }: DnaProfileCardsProps) {
  const t = useTranslations("assessment.results");

  return (
    <section>
      <h2 className="mb-1 text-2xl">{t("dnaProfile.sectionTitle")}</h2>
      <p className="mb-6 text-sm text-muted-foreground">{t("dnaProfile.sectionSubtitle")}</p>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {profile.map(({ key, score }) => {
          const Icon = DNA_ARCHETYPE_ICONS[key];
          return (
            <motion.div key={key} variants={itemVariants}>
              <Card className="h-full">
                <CardContent className="space-y-3 pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/15 text-accent-foreground">
                        <Icon className="h-4 w-4" />
                      </div>
                      <p className="font-display text-lg">{t(`dnaProfile.archetypes.${key}.name`)}</p>
                    </div>
                    <span className="text-sm font-semibold text-muted-foreground">{score}%</span>
                  </div>
                  <Progress value={score} />
                  <p className="text-xs text-muted-foreground">
                    {t(`dnaProfile.archetypes.${key}.description`)}
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
