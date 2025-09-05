"use client"

import * as React from "react"
import { useSession, signOut } from "next-auth/react"
import { Menu, Bell, User, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "../atoms/Button"
import { Icon } from "../atoms/Icon"
import { Typography } from "../atoms/Typography"

export interface NavbarProps {
  onMenuClick?: () => void
  className?: string
}

const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
  ({ onMenuClick, className }, ref) => {
    const { data: session } = useSession()

    return (
      <nav
        ref={ref}
        className={cn(
          "flex items-center justify-between h-16 px-4 bg-white border-b border-slate-200 shadow-sm",
          className
        )}
      >
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Icon icon={Menu} />
          </Button>
          <Typography variant="h4" className="hidden sm:block">
            KelSun Ventures Portal
          </Typography>
          <Typography variant="large" className="sm:hidden">
            KelSun
          </Typography>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Icon icon={Bell} />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              3
            </span>
          </Button>

          {session ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:block text-right">
                <Typography variant="small" className="font-medium">
                  {session.user?.name || "User"}
                </Typography>
                <Typography variant="muted" className="text-xs">
                  {session.user?.email}
                </Typography>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => signOut()}
                title="Sign out"
              >
                <Icon icon={LogOut} />
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="icon">
              <Icon icon={User} />
            </Button>
          )}
        </div>
      </nav>
    )
  }
)
Navbar.displayName = "Navbar"

export { Navbar }
