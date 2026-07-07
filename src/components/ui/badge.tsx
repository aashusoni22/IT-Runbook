import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold", {
  variants: {
    variant: {
      default: "bg-secondary text-secondary-foreground",
      accent: "bg-accent/15 text-accent",
      outline: "border border-border bg-transparent text-foreground",
      success: "bg-success/12 text-success",
      warning: "bg-warning/15 text-warning",
      critical: "bg-critical/12 text-critical",
      primary: "bg-primary text-primary-foreground"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}
