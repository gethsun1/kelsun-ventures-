"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Navbar } from "../organisms/Navbar"
import { Sidebar } from "../organisms/Sidebar"

export interface DashboardLayoutProps {
  children: React.ReactNode
  className?: string
}

const DashboardLayout = React.forwardRef<HTMLDivElement, DashboardLayoutProps>(
  ({ children, className }, ref) => {
    const [sidebarOpen, setSidebarOpen] = React.useState(false)

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
    const closeSidebar = () => setSidebarOpen(false)

    return (
      <div ref={ref} className={cn("min-h-screen bg-slate-50", className)}>
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        
        <div className="lg:ml-64">
          <Navbar onMenuClick={toggleSidebar} />
          
          <main className="p-4 lg:p-6">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    )
  }
)
DashboardLayout.displayName = "DashboardLayout"

export { DashboardLayout }
