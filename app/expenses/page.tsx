"use client"

import * as React from "react"
import { Plus, Search, Calendar, Filter, Edit, Trash2, DollarSign, TrendingUp, TrendingDown } from "lucide-react"
import { DashboardLayout } from "../components/templates/DashboardLayout"
import { Typography } from "../components/atoms/Typography"
import { Button } from "../components/atoms/Button"
import { Input } from "../components/atoms/Input"
import { Icon } from "../components/atoms/Icon"
import { DataTable, Column } from "../components/molecules/DataTable"
import { MetricCard } from "../components/molecules/MetricCard"
import { FormGroup } from "../components/molecules/FormGroup"
import { useExpenses, Expense } from "../hooks/useExpenses"

const EXPENSE_CATEGORIES = [
  "Office Supplies",
  "Transport",
  "Marketing",
  "Utilities",
  "Equipment",
  "Professional Services",
  "Travel",
  "Meals & Entertainment",
  "Insurance",
  "Other"
]

export default function ExpensesPage() {
  const [startDate, setStartDate] = React.useState("")
  const [endDate, setEndDate] = React.useState("")
  const [category, setCategory] = React.useState("")
  const [searchTerm, setSearchTerm] = React.useState("")
  const [showForm, setShowForm] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [editingExpense, setEditingExpense] = React.useState<Expense | null>(null)
  
  const { expenses, isLoading, createExpense, updateExpense, deleteExpense, mutate } = useExpenses(startDate, endDate, category)
  
  const [formData, setFormData] = React.useState({
    date: new Date().toISOString().split('T')[0],
    category: "",
    description: "",
    amount: "",
  })
  
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  // Filter expenses by search term
  const filteredExpenses = React.useMemo(() => {
    return expenses.filter(expense =>
      expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [expenses, searchTerm])

  // Calculate metrics
  const totalExpenses = React.useMemo(() => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0)
  }, [expenses])

  const thisMonthExpenses = React.useMemo(() => {
    const thisMonth = new Date()
    thisMonth.setDate(1)
    return expenses
      .filter(expense => new Date(expense.date) >= thisMonth)
      .reduce((sum, expense) => sum + expense.amount, 0)
  }, [expenses])

  const lastMonthExpenses = React.useMemo(() => {
    const lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)
    lastMonth.setDate(1)
    const lastMonthEnd = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0)
    
    return expenses
      .filter(expense => {
        const expenseDate = new Date(expense.date)
        return expenseDate >= lastMonth && expenseDate <= lastMonthEnd
      })
      .reduce((sum, expense) => sum + expense.amount, 0)
  }, [expenses])

  const monthlyChange = React.useMemo(() => {
    if (lastMonthExpenses === 0) return 0
    return ((thisMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100
  }, [thisMonthExpenses, lastMonthExpenses])

  const categoryBreakdown = React.useMemo(() => {
    const breakdown: Record<string, number> = {}
    expenses.forEach(expense => {
      breakdown[expense.category] = (breakdown[expense.category] || 0) + expense.amount
    })
    return breakdown
  }, [expenses])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.date) {
      newErrors.date = "Date is required"
    }

    if (!formData.category) {
      newErrors.category = "Category is required"
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0"
    }

    if (!formData.description?.trim()) {
      newErrors.description = "Description is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      if (editingExpense) {
        await updateExpense(editingExpense.id, {
          date: formData.date,
          category: formData.category,
          description: formData.description.trim(),
          amount: parseFloat(formData.amount),
        })
      } else {
        await createExpense({
          date: formData.date,
          category: formData.category,
          description: formData.description.trim(),
          amount: parseFloat(formData.amount),
        })
      }
      
      setShowForm(false)
      setEditingExpense(null)
      setFormData({
        date: new Date().toISOString().split('T')[0],
        category: "",
        description: "",
        amount: "",
      })
    } catch (error) {
      setErrors({ general: editingExpense ? "Failed to update expense" : "Failed to create expense" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense)
    setFormData({
      date: expense.date.split('T')[0],
      category: expense.category,
      description: expense.description || "",
      amount: expense.amount.toString(),
    })
    setShowForm(true)
  }

  const handleDeleteExpense = async (expense: Expense) => {
    if (window.confirm(`Are you sure you want to delete "${expense.description || expense.category}" expense?`)) {
      try {
        await deleteExpense(expense.id)
      } catch (error) {
        alert("Failed to delete expense")
      }
    }
  }

  const clearFilters = () => {
    setStartDate("")
    setEndDate("")
    setCategory("")
    setSearchTerm("")
  }

  const columns: Column<Expense>[] = [
    {
      key: "date",
      header: "Date",
      render: (value) => new Date(value as string).toLocaleDateString(),
    },
    {
      key: "category",
      header: "Category",
      render: (value) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
          {String(value)}
        </span>
      ),
    },
    {
      key: "description",
      header: "Description",
      render: (value) => (
        <Typography variant="small" className="font-medium">
          {value || "No description"}
        </Typography>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      render: (value) => (
        <span className="font-semibold text-red-600">
          KSH {(value as number).toLocaleString()}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (_, row) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEditExpense(row)}
            className="h-8 w-8"
          >
            <Icon icon={Edit} size="sm" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDeleteExpense(row)}
            className="h-8 w-8 text-red-600 hover:text-red-700"
          >
            <Icon icon={Trash2} size="sm" />
          </Button>
        </div>
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
              Expense Management
            </Typography>
            <Typography variant="muted">
              Track and manage your business expenses with detailed categorization.
            </Typography>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Icon icon={Plus} size="sm" />
            Add Expense
          </Button>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Total Expenses"
            value={`KSH ${totalExpenses.toLocaleString()}`}
            icon={DollarSign}
            iconColor="danger"
          />
          <MetricCard
            title="This Month"
            value={`KSH ${thisMonthExpenses.toLocaleString()}`}
            change={{ 
              value: Math.abs(monthlyChange), 
              type: monthlyChange >= 0 ? "increase" : "decrease" 
            }}
            icon={monthlyChange >= 0 ? TrendingUp : TrendingDown}
            iconColor="danger"
          />
          <MetricCard
            title="Total Entries"
            value={expenses.length}
            icon={DollarSign}
            iconColor="primary"
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <Icon icon={Filter} color="primary" />
            <Typography variant="h4">
              Filter Expenses
            </Typography>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <div>
              <Typography variant="small" className="mb-2 font-medium">
                Category
              </Typography>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Categories</option>
                {EXPENSE_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={clearFilters}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Input
            placeholder="Search expenses by description or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Icon
            icon={Search}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
            size="sm"
          />
        </div>

        {/* Expenses Table */}
        <DataTable
          data={filteredExpenses}
          columns={columns}
          emptyMessage={
            isLoading
              ? "Loading expenses..."
              : searchTerm || startDate || endDate || category
              ? "No expenses match your filters"
              : "No expenses found. Add your first expense to get started."
          }
        />

        {/* Expense Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 w-full max-w-md">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-100 rounded-xl">
                    <Icon icon={DollarSign} color="danger" />
                  </div>
                  <Typography variant="h4">
                    {editingExpense ? "Edit Expense" : "Add New Expense"}
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

                  <FormGroup label="Date" required error={errors.date}>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange("date", e.target.value)}
                    />
                  </FormGroup>

                  <FormGroup label="Category" required error={errors.category}>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange("category", e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select a category</option>
                      {EXPENSE_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </FormGroup>

                  <FormGroup label="Description" required error={errors.description}>
                    <Input
                      placeholder="Enter expense description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                    />
                  </FormGroup>

                  <FormGroup label="Amount (KSH)" required error={errors.amount}>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => handleInputChange("amount", e.target.value)}
                    />
                  </FormGroup>

                  <div className="flex gap-3 pt-4">
                    <Button type="submit" disabled={isSubmitting} className="flex-1">
                      {isSubmitting ? "Saving..." : editingExpense ? "Update Expense" : "Add Expense"}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setShowForm(false)
                        setEditingExpense(null)
                        setFormData({
                          date: new Date().toISOString().split('T')[0],
                          category: "",
                          description: "",
                          amount: "",
                        })
                      }}
                    >
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
