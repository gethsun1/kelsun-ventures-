"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import { User, Download, FileText, Settings as SettingsIcon } from "lucide-react"
import { DashboardLayout } from "../components/templates/DashboardLayout"
import { Typography } from "../components/atoms/Typography"
import { Button } from "../components/atoms/Button"
import { Input } from "../components/atoms/Input"
import { Icon } from "../components/atoms/Icon"
import { FormGroup } from "../components/molecules/FormGroup"

export default function SettingsPage() {
  const { data: session } = useSession()
  const [isUpdating, setIsUpdating] = React.useState(false)
  
  const [profileData, setProfileData] = React.useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
  })

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsUpdating(false)
      alert("Profile updated successfully!")
    }, 1000)
  }

  const handleExportData = (format: "csv" | "pdf") => {
    // Simulate export functionality
    alert(`Exporting data as ${format.toUpperCase()}...`)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <Typography variant="h2" className="mb-2">
            Settings
          </Typography>
          <Typography variant="muted">
            Manage your account settings and export business data.
          </Typography>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Settings */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-xl">
                <Icon icon={User} color="primary" />
              </div>
              <Typography variant="h4">
                Profile Settings
              </Typography>
            </div>

            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <FormGroup label="Full Name" required>
                <Input
                  value={profileData.name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                />
              </FormGroup>

              <FormGroup label="Email Address" required>
                <Input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                />
              </FormGroup>

              <Button type="submit" disabled={isUpdating} className="w-full">
                {isUpdating ? "Updating..." : "Update Profile"}
              </Button>
            </form>
          </div>

          {/* Data Export */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-xl">
                <Icon icon={Download} color="success" />
              </div>
              <Typography variant="h4">
                Data Export
              </Typography>
            </div>

            <div className="space-y-4">
              <Typography variant="muted">
                Export your business data for reporting and analysis.
              </Typography>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Icon icon={FileText} color="primary" />
                    <div>
                      <Typography variant="small" className="font-medium">
                        Monthly Report (CSV)
                      </Typography>
                      <Typography variant="muted" className="text-xs">
                        All transactions and inventory data
                      </Typography>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleExportData("csv")}
                  >
                    Export CSV
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Icon icon={FileText} color="danger" />
                    <div>
                      <Typography variant="small" className="font-medium">
                        Financial Report (PDF)
                      </Typography>
                      <Typography variant="muted" className="text-xs">
                        Formatted financial summary
                      </Typography>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleExportData("pdf")}
                  >
                    Export PDF
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Configuration */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-xl">
              <Icon icon={SettingsIcon} color="primary" />
            </div>
            <Typography variant="h4">
              System Configuration
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Typography variant="large" className="mb-2">
                Business Information
              </Typography>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Business Name:</span>
                  <span className="font-medium">KelSun Ventures</span>
                </div>
                <div className="flex justify-between">
                  <span>Currency:</span>
                  <span className="font-medium">KSH (Kenyan Shilling)</span>
                </div>
                <div className="flex justify-between">
                  <span>Time Zone:</span>
                  <span className="font-medium">EAT (UTC+3)</span>
                </div>
              </div>
            </div>

            <div>
              <Typography variant="large" className="mb-2">
                Application Info
              </Typography>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Version:</span>
                  <span className="font-medium">1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Updated:</span>
                  <span className="font-medium">December 2024</span>
                </div>
                <div className="flex justify-between">
                  <span>Database:</span>
                  <span className="font-medium">SQLite</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
