"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const t = useTranslations("marketing.hero");

  return (
    <section className="container flex flex-col items-center gap-8 py-24 text-center md:py-32">
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-secondary-foreground"
      >
        {t("eyebrow")}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="max-w-3xl text-4xl leading-tight md:text-6xl"
      >
        {t("title")}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-xl text-base text-muted-foreground md:text-lg"
      >
        {t("subtitle")}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex flex-col gap-3 sm:flex-row"
      >
        <Button size="lg" asChild>
          <Link href="/sign-up">
            {t("primaryCta")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button size="lg" variant="secondary" asChild>
          <Link href="/#how-it-works">{t("secondaryCta")}</Link>
        </Button>
      </motion.div>
    </section>
  );
}
