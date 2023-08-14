import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const linkVariants = cva(
  "inline-flex items-center justify-center font-medium transition-colors duration-300",
  {
    variants: {
      variant: {
        default: "text-white hover:text-accent",
        navbar:
          "text-white font-bold uppercase leading-6 tracking-[2px] hover:text-accent font-manrope",
        link: "text-primary underline-offset-4",
      },
      size: {
        default: "text-sm",
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

export { Link, linkVariants };
