"use client";

import { motion } from "framer-motion";

export function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
      <motion.div
        className="h-full rounded-full bg-accent"
        initial={false}
        animate={{ width: `${percent}%` }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
    </div>
  );
}
