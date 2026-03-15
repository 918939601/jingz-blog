"use client"

import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium disabled:pointer-events-none disabled:opacity-50 data-[state=on]:border-[#57b8ab]/45 data-[state=on]:bg-[#57b8ab]/14 data-[state=on]:text-primary [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none transition-[color,box-shadow,background-color] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-white/80 bg-white/82 shadow-[0_12px_28px_-22px_rgba(41,66,69,0.46)] hover:bg-white hover:text-primary dark:border-white/12 dark:bg-white/[0.06] dark:hover:bg-white/[0.1]",
      },
      size: {
        default: "h-9 min-w-9 px-4",
        sm: "h-8 min-w-8 px-3",
        lg: "h-10 min-w-10 px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
