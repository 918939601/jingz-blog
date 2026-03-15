import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border px-3 py-1 text-xs font-medium whitespace-nowrap [&>svg]:size-3 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow]",
  {
    variants: {
      variant: {
        default:
          "border-[#57b8ab]/30 bg-[#57b8ab]/14 text-primary [a&]:hover:bg-[#57b8ab]/18 dark:border-[#57b8ab]/24 dark:bg-[#57b8ab]/10",
        secondary:
          "border-white/80 bg-white/82 text-secondary-foreground [a&]:hover:bg-white dark:border-white/12 dark:bg-white/[0.06]",
        destructive:
          "border-red-400/28 bg-red-500/10 text-red-600 [a&]:hover:bg-red-500/14 focus-visible:ring-destructive/20 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-300",
        outline:
          "border-white/80 bg-white/82 text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground dark:border-white/12 dark:bg-white/[0.06]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
