import * as React from "react"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Icon } from "../atoms/Icon"
import { Typography } from "../atoms/Typography"

export interface MetricCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    type: "increase" | "decrease"
  }
  icon: LucideIcon
  iconColor?: "primary" | "success" | "warning" | "danger"
  className?: string
}

const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
  ({ title, value, change, icon, iconColor = "primary", className }, ref) => {
    const formatValue = (val: string | number) => {
      if (typeof val === "number") {
        return val.toLocaleString()
      }
      return val
    }

    const getChangeColor = (type: "increase" | "decrease") => {
      return type === "increase" ? "text-green-600" : "text-red-600"
    }

    const getIconBgColor = (color: string) => {
      switch (color) {
        case "primary":
          return "bg-blue-100"
        case "success":
          return "bg-green-100"
        case "warning":
          return "bg-yellow-100"
        case "danger":
          return "bg-red-100"
        default:
          return "bg-blue-100"
      }
    }

    return (
      <div
        ref={ref}
        className={cn(
          "bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow",
          className
        )}
      >
        <div className="flex items-start justify-between mb-4">
          <div className={cn("p-3 rounded-xl", getIconBgColor(iconColor))}>
            <Icon icon={icon} color={iconColor} size="lg" />
          </div>
          {change && (
            <div className="text-right">
              <Typography
                variant="small"
                className={cn("font-medium", getChangeColor(change.type))}
              >
                {change.type === "increase" ? "+" : "-"}{Math.abs(change.value)}%
              </Typography>
              <Typography variant="muted" className="text-xs">
                vs last month
              </Typography>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <Typography variant="muted" className="text-sm">
            {title}
          </Typography>
          <Typography variant="h3" className="font-bold">
            {formatValue(value)}
          </Typography>
        </div>
      </div>
    )
  }
)
MetricCard.displayName = "MetricCard"

export { MetricCard }
