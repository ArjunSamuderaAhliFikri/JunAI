import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-zinc-50 text-zinc-900 hover:bg-zinc-200/90 shadow-xs font-semibold",
        secondary:
          "bg-zinc-900 text-zinc-100 hover:bg-zinc-800/90 border border-zinc-800 shadow-xs",
        outline:
          "border border-zinc-800 bg-transparent hover:bg-zinc-900 hover:text-zinc-50 text-zinc-300 shadow-xs",
        ghost:
          "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/80",
        destructive:
          "bg-red-950/80 text-red-200 hover:bg-red-900/80 border border-red-800/60 shadow-xs",
        subtle:
          "bg-zinc-900/80 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 border border-zinc-800/70",
        link:
          "text-zinc-300 underline-offset-4 hover:underline hover:text-white p-0 h-auto",
      },
      size: {
        default: "h-8 px-3.5 py-1.5 text-xs",
        sm: "h-7 rounded-md px-2.5 text-xs",
        lg: "h-9 rounded-md px-4 text-sm font-semibold",
        icon: "h-8 w-8 p-0",
        iconSm: "h-7 w-7 p-0 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
