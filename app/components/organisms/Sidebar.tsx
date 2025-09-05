"use client"

import * as React from "react"
import { 
  LayoutDashboard, 
  Package, 
  Smartphone, 
  TrendingUp, 
  DollarSign, 
  Receipt,
  Settings,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "../atoms/Button"
import { Icon } from "../atoms/Icon"
import { Typography } from "../atoms/Typography"
import { NavItem } from "../molecules/NavItem"

export interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
  className?: string
}

const navigationItems = [
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
  },
  {
    href: "/inventory",
    icon: Package,
    label: "Inventory",
  },
  {
    href: "/mpesa",
    icon: Smartphone,
    label: "M-Pesa",
  },
  {
    href: "/expenses",
    icon: Receipt,
    label: "Expenses",
  },
  {
    href: "/adjustments",
    icon: TrendingUp,
    label: "Adjustments",
  },
  {
    href: "/investments",
    icon: DollarSign,
    label: "Investments",
  },
  {
    href: "/settings",
    icon: Settings,
    label: "Settings",
  },
]

const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  ({ isOpen = true, onClose, className }, ref) => {
    return (
      <>
        {/* Mobile overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}

        {/* Sidebar */}
        <aside
          ref={ref}
          className={cn(
            "fixed left-0 top-0 z-50 h-full w-64 bg-white border-r border-slate-200 shadow-sm transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto",
            isOpen ? "translate-x-0" : "-translate-x-full",
            className
          )}
        >
          <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200">
            <Typography variant="h4" className="text-blue-900">
              KelSun
            </Typography>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="lg:hidden"
            >
              <Icon icon={X} />
            </Button>
          </div>

          <nav className="p-4 space-y-2">
            {navigationItems.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
              />
            ))}
          </nav>
        </aside>
      </>
    )
  }
)
Sidebar.displayName = "Sidebar"

export { Sidebar }
