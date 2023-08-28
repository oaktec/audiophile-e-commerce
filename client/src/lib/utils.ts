import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortenName(name: string) {
  const words = name.split(" ");
  words.pop();
  return words.join(" ");
}
