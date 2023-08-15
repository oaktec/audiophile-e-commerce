import { cn } from "@/lib/utils";
import React from "react";

interface CnProps {
  className?: string;
  interactive?: boolean;
}

const baseIconClasses = "text-white";
const interactiveIconClasses = `cursor-pointer hover:text-accent duration-300 transition-colors`;

const buildCN = (classNameProp: string | undefined, interactive: boolean) =>
  cn(baseIconClasses, interactive && interactiveIconClasses, classNameProp);

export const UserIcon: React.FC<CnProps> = ({
  className,
  interactive = false,
}) => (
  <svg
    className={buildCN(className, interactive)}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M18 20a6 6 0 0 0-12 0" />
    <circle cx="12" cy="10" r="4" />
    <circle cx="12" cy="12" r="10" />
  </svg>
);

export const HamburgerIcon: React.FC<CnProps> = ({
  className,
  interactive = false,
}) => (
  <svg
    className={buildCN(className, interactive)}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

export const CartIcon: React.FC<CnProps> = ({
  className,
  interactive = false,
}) => (
  <svg
    className={buildCN(className, interactive)}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <circle cx="8" cy="21" r="1" />
    <circle cx="19" cy="21" r="1" />
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
  </svg>
);
