// src/shared/lib/cn.ts

// Simple utility to merge class names
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
