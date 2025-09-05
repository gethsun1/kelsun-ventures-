"use client"

import * as React from "react"
import { Plus, DollarSign, TrendingUp, Users, Calendar } from "lucide-react"
import { DashboardLayout } from "../components/templates/DashboardLayout"
import { Typography } from "../components/atoms/Typography"
import { Button } from "../components/atoms/Button"
import { Input } from "../components/atoms/Input"
import { Icon } from "../components/atoms/Icon"
import { DataTable, Column } from "../components/molecules/DataTable"
import { MetricCard } from "../components/molecules/MetricCard"
import { FormGroup } from "../components/molecules/FormGroup"
import { useInvestments, Investment } from "../hooks/useInvestments"

export default function InvestmentsPage() {
  const { investments, createInvestment, isLoading } = useInvestments()
  const [showForm, setShowForm] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  
  const [formData, setFormData] = React.useState({
    investorName: "",
    startDate: new Date().toISOString().split('T')[0],
    capital: "",
    profitShare: "",
  })
  
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  // Calculate metrics
  const totalCapital = React.useMemo(() => {
    return investments
      .filter(inv => inv.isActive)
      .reduce((sum, inv) => sum + inv.capital, 0)
  }, [investments])

  const totalCurrentProfit = React.useMemo(() => {
    return investments
      .filter(inv => inv.isActive)
      .reduce((sum, inv) => sum + inv.currentProfit, 0)
  }, [investments])

  const activeInvestors = React.useMemo(() => {
    return investments.filter(inv => inv.isActive).length
  }, [investments])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.investorName.trim()) {
      newErrors.investorName = "Investor name is required"
    }

    if (!formData.capital || parseFloat(formData.capital) <= 0) {
      newErrors.capital = "Capital must be greater than 0"
    }

    if (!formData.profitShare || parseFloat(formData.profitShare) <= 0 || parseFloat(formData.profitShare) > 1) {
      newErrors.profitShare = "Profit share must be between 0 and 1 (e.g., 0.3 for 30%)"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      await createInvestment({
        investorName: formData.investorName.trim(),
        startDate: formData.startDate,
        capital: parseFloat(formData.capital),
        profitShare: parseFloat(formData.profitShare),
      })
      
      setShowForm(false)
      setFormData({
        investorName: "",
        startDate: new Date().toISOString().split('T')[0],
        capital: "",
        profitShare: "",
      })
    } catch (error) {
      setErrors({ general: "Failed to create investment" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const columns: Column<Investment>[] = [
    {
      key: "investorName",
      header: "Investor Name",
      render: (value) => (
        <Typography variant="small" className="font-medium">
          {value}
        </Typography>
      ),
    },
    {
      key: "startDate",
      header: "Start Date",
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: "capital",
      header: "Capital",
      render: (value) => `KSH ${value.toLocaleString()}`,
    },
    {
      key: "currentProfit",
      header: "Current Profit",
      render: (value) => (
        <span className={value >= 0 ? "text-green-600" : "text-red-600"}>
          KSH {value.toLocaleString()}
        </span>
      ),
    },
    {
      key: "profitShare",
      header: "Profit Share",
      render: (value) => `${(value * 100).toFixed(1)}%`,
    },
    {
      key: "isActive",
      header: "Status",
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value 
            ? "bg-green-100 text-green-800" 
            : "bg-gray-100 text-gray-800"
        }`}>
          {value ? "Active" : "Inactive"}
        </span>
      ),
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h2" className="mb-2">
              Investments Overview
            </Typography>
            <Typography variant="muted">
              Manage investor relationships, track capital, and monitor profit distributions.
            </Typography>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Icon icon={Plus} size="sm" />
            Add Investment
          </Button>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricCard
            title="Total Capital"
            value={`KSH ${totalCapital.toLocaleString()}`}
            icon={DollarSign}
            iconColor="primary"
          />
          <MetricCard
            title="Current Profit"
            value={`KSH ${totalCurrentProfit.toLocaleString()}`}
            icon={TrendingUp}
            iconColor="success"
          />
          <MetricCard
            title="Active Investors"
            value={activeInvestors}
            icon={Users}
            iconColor="primary"
          />
          <MetricCard
            title="Average ROI"
            value={totalCapital > 0 ? `${((totalCurrentProfit / totalCapital) * 100).toFixed(1)}%` : "0%"}
            icon={TrendingUp}
            iconColor="success"
          />
        </div>

        {/* Investments Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <Typography variant="h4" className="mb-4">
            Investment Portfolio
          </Typography>
          <DataTable
            data={investments}
            columns={columns}
            emptyMessage={
              isLoading
                ? "Loading investments..."
                : "No investments found. Add your first investment to get started."
            }
          />
        </div>

        {/* Investment Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 w-full max-w-md">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-xl">
                    <Icon icon={DollarSign} color="primary" />
                  </div>
                  <Typography variant="h4">
                    Add New Investment
                  </Typography>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errors.general && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                      <Typography variant="small" className="text-red-800">
                        {errors.general}
                      </Typography>
                    </div>
                  )}

                  <FormGroup label="Investor Name" required error={errors.investorName}>
                    <Input
                      placeholder="Enter investor name"
                      value={formData.investorName}
                      onChange={(e) => handleInputChange("investorName", e.target.value)}
                    />
                  </FormGroup>

                  <FormGroup label="Start Date" required>
                    <Input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange("startDate", e.target.value)}
                    />
                  </FormGroup>

                  <FormGroup label="Capital (KSH)" required error={errors.capital}>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.capital}
                      onChange={(e) => handleInputChange("capital", e.target.value)}
                    />
                  </FormGroup>

                  <FormGroup label="Profit Share (0-1)" required error={errors.profitShare}>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.30 (for 30%)"
                      value={formData.profitShare}
                      onChange={(e) => handleInputChange("profitShare", e.target.value)}
                    />
                    <Typography variant="muted" className="text-xs mt-1">
                      Enter as decimal (e.g., 0.3 for 30%)
                    </Typography>
                  </FormGroup>

                  <div className="flex gap-3 pt-4">
                    <Button type="submit" disabled={isSubmitting} className="flex-1">
                      {isSubmitting ? "Adding..." : "Add Investment"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
