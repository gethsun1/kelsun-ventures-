import * as React from "react"
import { cn } from "@/lib/utils"
import { Typography } from "../atoms/Typography"

export interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
  className?: string
}

const AuthLayout = React.forwardRef<HTMLDivElement, AuthLayoutProps>(
  ({ children, title, subtitle, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4",
          className
        )}
      >
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
            <div className="text-center mb-8">
              <Typography variant="h2" className="text-blue-900 mb-2">
                KelSun Ventures
              </Typography>
              <Typography variant="h3" className="mb-2">
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="muted">
                  {subtitle}
                </Typography>
              )}
            </div>
            
            {children}
          </div>
          
          <div className="text-center mt-6">
            <Typography variant="muted" className="text-xs">
              © {new Date().getFullYear()} KelSun Ventures. All rights reserved.
            </Typography>
          </div>
        </div>
      </div>
    )
  }
)
AuthLayout.displayName = "AuthLayout"

export { AuthLayout }
