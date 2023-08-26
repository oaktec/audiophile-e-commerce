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

export const TypographyProductSubHeader: React.FC<TypographyProps> = ({
  children,
  className,
}) => (
  <h3
    className={cn(
      "text-2xl font-bold uppercase leading-9 tracking-[0.05356rem] text-black sm:text-[2rem] sm:tracking-[0.07144rem]",
      className,
    )}
  >
    {children}
  </h3>
);

export const TypographyFormHeader: React.FC<TypographyProps> = ({
  children,
  className,
}) => (
  <h1
    className={cn(
      "pb-2 text-[1.75rem] font-bold uppercase tracking-[0.0625rem] text-black sm:pb-4 sm:text-[2rem] sm:leading-9 sm:tracking-[0.07144rem]",
      className,
    )}
  >
    {children}
  </h1>
);

export const TypographyProductTitle: React.FC<TypographyProps> = ({
  children,
  className,
}) => (
  <h3
    className={cn(
      "text-[1.75rem] font-bold uppercase tracking-[0.0625rem] text-black sm:pb-4 sm:text-[2.5rem] sm:leading-[2.75rem] sm:tracking-[0.08931rem]",
      className,
    )}
  >
    {children}
  </h3>
);

export const TypographyNewProduct: React.FC<TypographyProps> = ({
  children,
  className,
}) => (
  <p
    className={cn(
      "text-sm uppercase tracking-[0.625rem] text-accent",
      className,
    )}
  >
    {children}
  </p>
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
  <p
    className={cn(
      "text-[0.9375rem] font-medium leading-[1.5625rem] text-black opacity-50",
      className,
    )}
  >
    {children}
  </p>
);
