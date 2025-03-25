import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-black/40 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Neutral filled : Dia's "ready when you are" anti-CTA
        default:
          "rounded-button bg-pebble text-ink-black/85 hover:bg-ink-black hover:text-snow",
        // Solid black : used sparingly, e.g. inside dark contexts
        solid:
          "rounded-button bg-ink-black text-snow hover:bg-ink-black/90",
        // Ghost pill : secondary nav, tabs
        ghost:
          "rounded-full text-ink-black/85 hover:bg-ink-black/[0.04]",
        // Soft contextual fill : announcement bars, secondary inline actions
        soft:
          "rounded-nav bg-ink-black/[0.04] text-ink-black/85 hover:bg-ink-black/[0.08]",
        // Outline : quiet alternative to default
        outline:
          "rounded-button border border-ink-black/10 bg-snow/70 text-ink-black hover:border-ink-black/25",
        // Compat
        secondary:
          "rounded-button bg-fog text-ink-black hover:bg-pebble",
        destructive:
          "rounded-button bg-spectrum-red text-snow hover:bg-spectrum-red/90",
        link:
          "text-ink-black underline underline-offset-[3px] decoration-ink-black/35 hover:decoration-ink-black",
      },
      size: {
        default: "h-11 px-5 text-body-sm",
        sm: "h-9 px-4 text-body-sm",
        lg: "h-12 px-7 text-body",
        icon: "h-10 w-10 rounded-full",
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
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
