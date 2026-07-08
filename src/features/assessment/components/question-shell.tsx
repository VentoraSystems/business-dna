"use client";

import { AnimatePresence, motion } from "framer-motion";

interface QuestionShellProps {
  motionKey: string;
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}

export function QuestionShell({
  motionKey,
  eyebrow,
  title,
  description,
  children,
  footer,
}: QuestionShellProps) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={motionKey}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-accent-foreground">
            {eyebrow}
          </p>
          <h1 className="mb-2 text-[28px] leading-tight">{title}</h1>
          {description && <p className="mb-8 text-sm text-muted-foreground">{description}</p>}
          {!description && <div className="mb-8" />}
          <div>{children}</div>
        </motion.div>
      </AnimatePresence>
      <div className="mt-10">{footer}</div>
    </div>
  );
}
