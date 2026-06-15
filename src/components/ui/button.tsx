"use client";

import { cva, type VariantProps } from "class-variance-authority";

import { useInteraction } from "@/components/providers/interaction-provider";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--accent)] text-black hover:brightness-110 shadow-[0_0_30px_-8px_var(--accent)]",
        outline:
          "border border-white/15 bg-white/5 text-white hover:bg-white/10 backdrop-blur",
        ghost: "text-white/80 hover:text-white hover:bg-white/5",
      },
      size: {
        default: "h-11 px-6",
        lg: "h-12 px-8 text-base",
        sm: "h-9 px-4 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({
  className,
  variant,
  size,
  onClick,
  ...props
}: ButtonProps) {
  const interaction = useInteraction();

  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      onClick={(event) => {
        interaction?.playClick();
        onClick?.(event);
      }}
      {...props}
    />
  );
}
