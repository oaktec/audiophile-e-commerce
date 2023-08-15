import { cn } from "@/lib/utils";
import React from "react";

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

export const TypographyHeaderMain: React.FC<TypographyProps> = ({
  children,
  className,
}) => (
  <span
    className={cn(
      "text-4xl font-bold uppercase tracking-[1.286px] text-white sm:text-[3.5rem] sm:leading-[3.625rem] sm:tracking-[0.125rem]",
      className,
    )}
  >
    {children}
  </span>
);

export const TypographyHeaderDescription: React.FC<TypographyProps> = ({
  children,
  className,
}) => (
  <span
    className={cn(
      "text-[0.9375rem] font-medium leading-relaxed text-white opacity-75",
      className,
    )}
  >
    {children}
  </span>
);
