import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ih-blue)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--ih-navy)] text-white shadow-sm hover:-translate-y-0.5 hover:bg-[#0d2748]",
        primary:
          "bg-[linear-gradient(135deg,#2F6FED,#6E4BFF)] text-white shadow-[0_10px_24px_rgba(47,111,237,0.28)] hover:-translate-y-0.5",
        secondary:
          "bg-white text-[var(--ih-navy)] ring-1 ring-slate-200 hover:bg-slate-50",
        outline:
          "border border-white/20 bg-transparent text-white hover:bg-white/10",
        ghost: "text-[var(--ih-navy)] hover:bg-slate-100",
        danger: "bg-red-600 text-white hover:bg-red-700",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-7 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { buttonVariants };
