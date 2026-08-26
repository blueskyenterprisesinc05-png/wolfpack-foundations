import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Hierarchy rule (locked): at most ONE `default` (stark off-white) button per view.
 * `crimson` is reserved for high-stakes actions; `destructive` for deletion.
 */
const buttonVariants = cva(
  "motion-base inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-body font-semibold tracking-wide cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-45 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-raised hover:bg-primary/88",
        secondary:
          "border border-border bg-secondary text-secondary-foreground hover:bg-accent hover:border-muted-foreground/40",
        outline: "border border-border bg-transparent text-foreground hover:bg-secondary",
        ghost: "bg-transparent text-muted-foreground hover:bg-secondary hover:text-foreground",
        gold: "bg-gold text-obsidian shadow-gold hover:bg-gold-tint",
        crimson: "bg-crimson text-foreground shadow-raised hover:bg-crimson/88",
        destructive:
          "border border-crimson/45 bg-transparent text-crimson-tint hover:bg-crimson hover:text-foreground hover:border-crimson",
        link: "text-gold underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 rounded-md px-3 text-xs",
        default: "h-11 px-5 text-sm",
        lg: "h-12 px-7 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={asChild ? undefined : loading || props.disabled}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading ? <Loader2 className="animate-spin" /> : children}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
