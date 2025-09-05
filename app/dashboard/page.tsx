"use client"

import * as React from "react"
import { 
  DollarSign, 
  Package, 
  Smartphone, 
  TrendingUp,
  AlertTriangle,
  Plus
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts"
import { DashboardLayout } from "../components/templates/DashboardLayout"
import { Typography } from "../components/atoms/Typography"
import { Button } from "../components/atoms/Button"
import { Icon } from "../components/atoms/Icon"
import { MetricCard } from "../components/molecules/MetricCard"
import { useDashboard } from "../hooks/useDashboard"

export default function DashboardPage() {
  const { data, isLoading, error } = useDashboard()

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-900"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Typography variant="h4" className="text-red-600 mb-2">
              Error Loading Dashboard
            </Typography>
            <Typography variant="muted">
              Please try refreshing the page
            </Typography>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h2" className="mb-2">
              Dashboard
            </Typography>
            <Typography variant="muted">
              Welcome back! Here's what's happening with your business today.
            </Typography>
          </div>
          <Button>
            <Icon icon={Plus} size="sm" />
            Quick Add
          </Button>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Investments"
            value={`KSH ${data.metrics.totalInvestments.toLocaleString()}`}
            change={{ 
              value: Math.abs(data.metrics.totalInvestmentsChange), 
              type: data.metrics.totalInvestmentsChange >= 0 ? "increase" : "decrease" 
            }}
            icon={DollarSign}
            iconColor="primary"
          />
          <MetricCard
            title="Low Stock Items"
            value={data.metrics.lowStockItems}
            change={{ 
              value: Math.abs(data.metrics.lowStockItemsChange), 
              type: data.metrics.lowStockItemsChange >= 0 ? "increase" : "decrease" 
            }}
            icon={Package}
            iconColor="warning"
          />
          <MetricCard
            title="Today's M-Pesa Net Flow"
            value={`KSH ${data.metrics.todayMpesaNetFlow.toLocaleString()}`}
            change={{ 
              value: Math.abs(data.metrics.todayMpesaNetFlowChange), 
              type: data.metrics.todayMpesaNetFlowChange >= 0 ? "increase" : "decrease" 
            }}
            icon={Smartphone}
            iconColor="success"
          />
          <MetricCard
            title="Monthly Profit Share"
            value={`KSH ${data.metrics.monthlyProfitShare.toLocaleString()}`}
            change={{ 
              value: Math.abs(data.metrics.monthlyProfitShareChange), 
              type: data.metrics.monthlyProfitShareChange >= 0 ? "increase" : "decrease" 
            }}
            icon={TrendingUp}
            iconColor="primary"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Earnings Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="mb-6">
              <Typography variant="h4" className="mb-2">
                Earnings Overview
              </Typography>
              <Typography variant="muted">
                Monthly earnings vs expenses comparison
              </Typography>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.charts.earningsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#64748b"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#64748b"
                    fontSize={12}
                    tickFormatter={(value) => `${value / 1000}K`}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`KSH ${value.toLocaleString()}`, ""]}
                    labelStyle={{ color: "#1e293b" }}
                    contentStyle={{ 
                      backgroundColor: "white", 
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px"
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="earnings" 
                    stroke="#1e3a8a" 
                    strokeWidth={3}
                    dot={{ fill: "#1e3a8a", strokeWidth: 2, r: 4 }}
                    name="Earnings"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="expenses" 
                    stroke="#ef4444" 
                    strokeWidth={3}
                    dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
                    name="Expenses"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* M-Pesa Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="mb-6">
              <Typography variant="h4" className="mb-2">
                M-Pesa Activity
              </Typography>
              <Typography variant="muted">
                Weekly deposits vs withdrawals
              </Typography>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.charts.mpesaData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="day" 
                    stroke="#64748b"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#64748b"
                    fontSize={12}
                    tickFormatter={(value) => `${value / 1000}K`}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`KSH ${value.toLocaleString()}`, ""]}
                    labelStyle={{ color: "#1e293b" }}
                    contentStyle={{ 
                      backgroundColor: "white", 
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px"
                    }}
                  />
                  <Bar 
                    dataKey="deposits" 
                    fill="#10b981" 
                    radius={[4, 4, 0, 0]}
                    name="Deposits"
                  />
                  <Bar 
                    dataKey="withdrawals" 
                    fill="#f59e0b" 
                    radius={[4, 4, 0, 0]}
                    name="Withdrawals"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Alerts Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-100 rounded-xl">
              <Icon icon={AlertTriangle} color="warning" />
            </div>
            <Typography variant="h4">
              Alerts & Notifications
            </Typography>
          </div>
          <div className="space-y-3">
            {data.metrics.lowStockItems > 0 && (
              <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <div>
                  <Typography variant="small" className="font-medium text-yellow-800">
                    Low Stock Alert
                  </Typography>
                  <Typography variant="muted" className="text-yellow-600 text-xs">
                    {data.metrics.lowStockItems} item{data.metrics.lowStockItems > 1 ? 's' : ''} {data.metrics.lowStockItems > 1 ? 'are' : 'is'} below reorder threshold
                  </Typography>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href="/inventory">View Items</a>
                </Button>
              </div>
            )}
            {data.metrics.todayMpesaNetFlow === 0 && (
              <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div>
                  <Typography variant="small" className="font-medium text-blue-800">
                    M-Pesa Entry Needed
                  </Typography>
                  <Typography variant="muted" className="text-blue-600 text-xs">
                    No M-Pesa entries recorded for today
                  </Typography>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href="/mpesa">Add Entry</a>
                </Button>
              </div>
            )}
            {data.metrics.totalInvestments === 0 && (
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
                <div>
                  <Typography variant="small" className="font-medium text-green-800">
                    Welcome to KelSun Ventures Portal
                  </Typography>
                  <Typography variant="muted" className="text-green-600 text-xs">
                    Start by adding your first investment to track your business
                  </Typography>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href="/investments">Add Investment</a>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
