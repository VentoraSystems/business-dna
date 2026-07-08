import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge conditional class names and resolve Tailwind conflicts.
 * Use this in every component instead of concatenating strings by hand.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
