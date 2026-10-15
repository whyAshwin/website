import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function range(start: number, end: number, step = 1) {
  const out: number[] = [];
  for (let i = start; i < end; i += step) out.push(i);
  return out;
}
