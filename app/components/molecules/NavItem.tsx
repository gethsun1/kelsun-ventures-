import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Icon } from "../atoms/Icon"
import { Typography } from "../atoms/Typography"
import { LucideIcon } from "lucide-react"

export interface NavItemProps {
  href: string
  icon: LucideIcon
  label: string
  badge?: string | number
  className?: string
}

const NavItem = React.forwardRef<HTMLAnchorElement, NavItemProps>(
  ({ href, icon, label, badge, className }, ref) => {
    const pathname = usePathname()
    const isActive = pathname === href

    return (
      <Link
        href={href}
        ref={ref}
        className={cn(
          "flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium transition-colors hover:bg-slate-100 hover:text-slate-900",
          isActive
            ? "bg-blue-900 text-blue-50 hover:bg-blue-800 hover:text-blue-50"
            : "text-slate-700",
          className
        )}
      >
        <Icon
          icon={icon}
          size="default"
          color={isActive ? "default" : "default"}
          className={isActive ? "text-blue-50" : "text-slate-700"}
        />
        <Typography
          variant="small"
          className={cn(
            "flex-1",
            isActive ? "text-blue-50" : "text-slate-700"
          )}
        >
          {label}
        </Typography>
        {badge && (
          <span
            className={cn(
              "inline-flex items-center justify-center rounded-full px-2 py-1 text-xs font-medium",
              isActive
                ? "bg-blue-800 text-blue-50"
                : "bg-slate-100 text-slate-700"
            )}
          >
            {badge}
          </span>
        )}
      </Link>
    )
  }
)
NavItem.displayName = "NavItem"

export { NavItem }
