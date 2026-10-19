import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors border",
  {
    variants: {
      variant: {
        default:
          "border-zinc-700 bg-zinc-100 text-zinc-950 font-semibold",
        secondary:
          "border-zinc-800 bg-zinc-900 text-zinc-300",
        outline:
          "border-zinc-800 text-zinc-400 bg-transparent",
        destructive:
          "border-red-900/40 bg-red-950/40 text-red-300",
        success:
          "border-emerald-900/40 bg-emerald-950/40 text-emerald-400",
        warning:
          "border-amber-900/40 bg-amber-950/40 text-amber-300",
        info:
          "border-sky-900/40 bg-sky-950/40 text-sky-300",
        discord:
          "border-indigo-900/40 bg-indigo-950/40 text-indigo-300",
        zoom:
          "border-blue-900/40 bg-blue-950/40 text-blue-300",
        gmeet:
          "border-emerald-900/40 bg-emerald-950/40 text-emerald-300",
      },
    },
    defaultVariants: {
      variant: "secondary",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
