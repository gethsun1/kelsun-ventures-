"use client"

import * as React from "react"
import { Calendar, Smartphone, TrendingUp, TrendingDown } from "lucide-react"
import { DashboardLayout } from "../components/templates/DashboardLayout"
import { Typography } from "../components/atoms/Typography"
import { Button } from "../components/atoms/Button"
import { Input } from "../components/atoms/Input"
import { Icon } from "../components/atoms/Icon"
import { DataTable, Column } from "../components/molecules/DataTable"
import { MetricCard } from "../components/molecules/MetricCard"
import { MpesaEntryForm } from "../components/organisms/MpesaEntryForm"
import { useMpesa, MpesaEntry } from "../hooks/useMpesa"

export default function MpesaPage() {
  const [startDate, setStartDate] = React.useState("")
  const [endDate, setEndDate] = React.useState("")
  const [showStartForm, setShowStartForm] = React.useState(false)
  const [showEndForm, setShowEndForm] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const { entries, isLoading, createEntry } = useMpesa(startDate, endDate)

  // Calculate metrics
  const todayEntries = React.useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    return entries.filter(entry => entry.date.startsWith(today))
  }, [entries])

  const todayNetFlow = React.useMemo(() => {
    return todayEntries.reduce((sum, entry) => sum + (entry.netChange || 0), 0)
  }, [todayEntries])

  const weeklyNetFlow = React.useMemo(() => {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const weekAgoStr = weekAgo.toISOString().split('T')[0]
    
    return entries
      .filter(entry => entry.date >= weekAgoStr)
      .reduce((sum, entry) => sum + (entry.netChange || 0), 0)
  }, [entries])

  const handleCreateEntry = async (data: Omit<MpesaEntry, "id" | "createdAt" | "updatedAt" | "netChange">) => {
    setIsSubmitting(true)
    try {
      await createEntry(data)
      setShowStartForm(false)
      setShowEndForm(false)
    } catch (error) {
      alert("Failed to create entry")
    } finally {
      setIsSubmitting(false)
    }
  }

  const columns: Column<MpesaEntry>[] = [
    {
      key: "date",
      header: "Date",
      render: (value) => new Date(value as string).toLocaleDateString(),
    },
    {
      key: "type",
      header: "Type",
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === "start_of_day" 
            ? "bg-blue-100 text-blue-800" 
            : "bg-green-100 text-green-800"
        }`}>
          {value === "start_of_day" ? "Start of Day" : "End of Day"}
        </span>
      ),
    },
    {
      key: "startingFloat",
      header: "Starting Float",
      render: (value) => value ? `KSH ${(value as number).toLocaleString()}` : "-",
    },
    {
      key: "deposits",
      header: "Deposits",
      render: (value) => value ? `KSH ${(value as number).toLocaleString()}` : "-",
    },
    {
      key: "withdrawals",
      header: "Withdrawals",
      render: (value) => value ? `KSH ${(value as number).toLocaleString()}` : "-",
    },
    {
      key: "fees",
      header: "Fees",
      render: (value) => value ? `KSH ${(value as number).toLocaleString()}` : "-",
    },
    {
      key: "netChange",
      header: "Net Change",
      render: (value) => {
        if (value === null || value === undefined) return "-"
        const isPositive = value >= 0
        return (
          <span className={`font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>
            {isPositive ? "+" : ""}KSH {(value as number).toLocaleString()}
          </span>
        )
      },
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h2" className="mb-2">
              M-Pesa Transaction Tracking
            </Typography>
            <Typography variant="muted">
              Monitor daily float, track transactions, and reconcile M-Pesa operations.
            </Typography>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setShowStartForm(true)} variant="outline">
              <Icon icon={Smartphone} size="sm" />
              Start of Day
            </Button>
            <Button onClick={() => setShowEndForm(true)}>
              <Icon icon={TrendingUp} size="sm" />
              End of Day
            </Button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Today's Net Flow"
            value={`KSH ${todayNetFlow.toLocaleString()}`}
            icon={todayNetFlow >= 0 ? TrendingUp : TrendingDown}
            iconColor={todayNetFlow >= 0 ? "success" : "danger"}
          />
          <MetricCard
            title="Weekly Net Flow"
            value={`KSH ${weeklyNetFlow.toLocaleString()}`}
            icon={weeklyNetFlow >= 0 ? TrendingUp : TrendingDown}
            iconColor={weeklyNetFlow >= 0 ? "success" : "danger"}
          />
          <MetricCard
            title="Total Entries"
            value={entries.length}
            icon={Smartphone}
            iconColor="primary"
          />
        </div>

        {/* Date Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <Typography variant="h4" className="mb-4">
            Filter Transactions
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Typography variant="small" className="mb-2 font-medium">
                Start Date
              </Typography>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <Typography variant="small" className="mb-2 font-medium">
                End Date
              </Typography>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setStartDate("")
                  setEndDate("")
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <DataTable
          data={entries}
          columns={columns}
          emptyMessage={
            isLoading
              ? "Loading transactions..."
              : "No M-Pesa transactions found. Add your first entry to get started."
          }
        />

        {/* Forms */}
        {showStartForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 w-full max-w-md">
              <MpesaEntryForm
                type="start_of_day"
                onSubmit={handleCreateEntry}
                onCancel={() => setShowStartForm(false)}
                isLoading={isSubmitting}
                className="p-6"
              />
            </div>
          </div>
        )}

        {showEndForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 w-full max-w-md">
              <MpesaEntryForm
                type="end_of_day"
                onSubmit={handleCreateEntry}
                onCancel={() => setShowEndForm(false)}
                isLoading={isSubmitting}
                className="p-6"
              />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
