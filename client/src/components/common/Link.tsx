import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const linkVariants = cva(
  "inline-flex items-center justify-center font-medium transition-colors duration-300 cursor-pointer",
  {
    variants: {
      variant: {
        default: "text-white hover:text-accent text-sm",
        button:
          "bg-accent text-white text-[0.8125rem] hover:bg-accent-hover uppercase font-bold tracking-[0.0625rem] h-12 w-40 px-4 py-2",
        navbar:
          "text-white font-bold uppercase leading-6 tracking-[2px] hover:text-accent font-manrope",
      },
      size: {
        default: "",
        sm: "text-xs",
        lg: "text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkVariants> {}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <a
        className={cn(linkVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Link.displayName = "Link";

export { Link };
