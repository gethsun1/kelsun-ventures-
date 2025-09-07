import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

const iconVariants = cva("", {
  variants: {
    size: {
      sm: "h-4 w-4",
      default: "h-5 w-5",
      lg: "h-6 w-6",
      xl: "h-8 w-8",
    },
    color: {
      default: "text-slate-700",
      primary: "text-blue-900",
      secondary: "text-slate-500",
      success: "text-green-600",
      warning: "text-yellow-600",
      danger: "text-red-600",
      muted: "text-slate-400",
    },
  },
  defaultVariants: {
    size: "default",
    color: "default",
  },
})

export interface IconProps
  extends Omit<React.SVGAttributes<SVGElement>, 'color'>,
    VariantProps<typeof iconVariants> {
  icon: LucideIcon
}

const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, size, color, icon: IconComponent, ...props }, ref) => {
    return (
      <IconComponent
        className={cn(iconVariants({ size, color, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Icon.displayName = "Icon"

export { Icon, iconVariants }
