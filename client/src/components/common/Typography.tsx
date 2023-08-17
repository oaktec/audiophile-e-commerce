import { cn } from "@/lib/utils";
import React from "react";

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

export const TypographyHeader: React.FC<TypographyProps> = ({
  children,
  className,
}) => (
  <h2
    className={cn(
      "text-4xl font-bold uppercase tracking-[0.08038rem] text-white sm:text-[3.5rem] sm:leading-[3.625rem] sm:tracking-[0.125rem]",
      className,
    )}
  >
    {children}
  </h2>
);

export const TypographySubHeader: React.FC<TypographyProps> = ({
  children,
  className,
}) => (
  <h2
    className={cn(
      "text-[1.75rem] font-bold uppercase tracking-[0.125rem] text-black",
      className,
    )}
  >
    {children}
  </h2>
);

export const TypographyDescription: React.FC<TypographyProps> = ({
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

export const TypographyParagraph: React.FC<TypographyProps> = ({
  children,
  className,
}) => (
  <span
    className={cn(
      "text-[0.9375rem] font-medium leading-[1.5625rem] text-black opacity-50",
      className,
    )}
  >
    {children}
  </span>
);
