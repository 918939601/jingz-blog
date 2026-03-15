"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "glass-panel rounded-[22px] border-white/80 px-4 py-3 shadow-[0_24px_70px_-42px_rgba(41,66,69,0.48)] dark:border-white/12",
          title: "paper-title text-sm text-foreground",
          description: "text-sm leading-6 text-foreground/62",
          actionButton:
            "rounded-full bg-primary px-4 py-2 text-primary-foreground",
          cancelButton:
            "rounded-full border border-white/80 bg-white/82 px-4 py-2 text-foreground dark:border-white/12 dark:bg-white/[0.06]",
          success:
            "!border-[#57b8ab]/35 dark:!border-[#57b8ab]/28",
          error:
            "!border-red-400/35 dark:!border-red-400/28",
          warning:
            "!border-amber-400/35 dark:!border-amber-400/28",
          info:
            "!border-sky-400/35 dark:!border-sky-400/28",
        },
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
