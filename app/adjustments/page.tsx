"use client"

import * as React from "react"
import { Plus, ShoppingCart, Receipt, Calculator } from "lucide-react"
import { DashboardLayout } from "../components/templates/DashboardLayout"
import { Typography } from "../components/atoms/Typography"
import { Button } from "../components/atoms/Button"
import { Input } from "../components/atoms/Input"
import { Icon } from "../components/atoms/Icon"
import { DataTable, Column } from "../components/molecules/DataTable"
import { MetricCard } from "../components/molecules/MetricCard"
import { FormGroup } from "../components/molecules/FormGroup"
import { useAdjustments, Adjustment } from "../hooks/useAdjustments"
import { useExpenses, Expense } from "../hooks/useExpenses"
import { useInventory } from "../hooks/useInventory"

export default function AdjustmentsPage() {
  const { adjustments, createAdjustment } = useAdjustments()
  const { expenses, createExpense } = useExpenses()
  const { items } = useInventory()
  
  const [showItemPickedForm, setShowItemPickedForm] = React.useState(false)
  const [showExpenseForm, setShowExpenseForm] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Item picked form state
  const [itemPickedData, setItemPickedData] = React.useState({
    inventoryItemId: "",
    quantity: "",
    date: new Date().toISOString().split('T')[0],
    description: "",
  })

  // Expense form state
  const [expenseData, setExpenseData] = React.useState({
    category: "",
    amount: "",
    date: new Date().toISOString().split('T')[0],
    description: "",
  })

  const [errors, setErrors] = React.useState<Record<string, string>>({})

  // Calculate metrics
  const totalItemsPickedValue = React.useMemo(() => {
    return adjustments
      .filter(adj => adj.type === "item_picked")
      .reduce((sum, adj) => {
        if (adj.quantity && adj.inventoryItem) {
          return sum + (adj.quantity * adj.inventoryItem.unitCost)
        }
        return sum
      }, 0)
  }, [adjustments])

  const totalExpenses = React.useMemo(() => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0)
  }, [expenses])

  const monthlyProfitAdjustment = totalItemsPickedValue + totalExpenses

  const handleItemPickedSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const newErrors: Record<string, string> = {}
    if (!itemPickedData.inventoryItemId) newErrors.inventoryItemId = "Please select an item"
    if (!itemPickedData.quantity || parseInt(itemPickedData.quantity) <= 0) {
      newErrors.quantity = "Quantity must be greater than 0"
    }
    
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setIsSubmitting(true)
    try {
      const selectedItem = items.find(item => item.id === itemPickedData.inventoryItemId)
      const calculatedAmount = selectedItem ? parseInt(itemPickedData.quantity) * selectedItem.unitCost : 0
      
      await createAdjustment({
        type: "item_picked",
        date: itemPickedData.date,
        description: itemPickedData.description || `${itemPickedData.quantity} units picked by investor`,
        quantity: parseInt(itemPickedData.quantity),
        amount: calculatedAmount,
        inventoryItemId: itemPickedData.inventoryItemId,
      })
      
      setShowItemPickedForm(false)
      setItemPickedData({
        inventoryItemId: "",
        quantity: "",
        date: new Date().toISOString().split('T')[0],
        description: "",
      })
    } catch (error) {
      setErrors({ general: "Failed to record item picked" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const newErrors: Record<string, string> = {}
    if (!expenseData.category.trim()) newErrors.category = "Category is required"
    if (!expenseData.amount || parseFloat(expenseData.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0"
    }
    
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setIsSubmitting(true)
    try {
      await createExpense({
        category: expenseData.category.trim(),
        amount: parseFloat(expenseData.amount),
        date: expenseData.date,
        description: expenseData.description || undefined,
      })
      
      setShowExpenseForm(false)
      setExpenseData({
        category: "",
        amount: "",
        date: new Date().toISOString().split('T')[0],
        description: "",
      })
    } catch (error) {
      setErrors({ general: "Failed to record expense" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const adjustmentColumns: Column<Adjustment>[] = [
    {
      key: "date",
      header: "Date",
      render: (value) => new Date(value as string).toLocaleDateString(),
    },
    {
      key: "type",
      header: "Type",
      render: (value) => (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {value === "item_picked" ? "Item Picked" : String(value)}
        </span>
      ),
    },
    {
      key: "inventoryItem.name",
      header: "Item",
      render: (_, row) => row.inventoryItem?.name || "-",
    },
    {
      key: "quantity",
      header: "Quantity",
      render: (value) => value ? `${value} units` : "-",
    },
    {
      key: "amount",
      header: "Value",
      render: (value) => value ? `KSH ${value.toLocaleString()}` : "-",
    },
    {
      key: "description",
      header: "Description",
      render: (value) => String(value || "-"),
    },
  ]

  const expenseColumns: Column<Expense>[] = [
    {
      key: "date",
      header: "Date",
      render: (value) => new Date(value as string).toLocaleDateString(),
    },
    {
      key: "category",
      header: "Category",
      render: (value) => (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          {String(value)}
        </span>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      render: (value) => `KSH ${(value as number).toLocaleString()}`,
    },
    {
      key: "description",
      header: "Description",
      render: (value) => String(value || "-"),
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h2" className="mb-2">
              Profit-Share Adjustments
            </Typography>
            <Typography variant="muted">
              Track items picked by investors and business expenses for profit-share calculations.
            </Typography>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setShowItemPickedForm(true)} variant="outline">
              <Icon icon={ShoppingCart} size="sm" />
              Item Picked
            </Button>
            <Button onClick={() => setShowExpenseForm(true)}>
              <Icon icon={Receipt} size="sm" />
              Add Expense
            </Button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Items Picked Value"
            value={`KSH ${totalItemsPickedValue.toLocaleString()}`}
            icon={ShoppingCart}
            iconColor="warning"
          />
          <MetricCard
            title="Total Expenses"
            value={`KSH ${totalExpenses.toLocaleString()}`}
            icon={Receipt}
            iconColor="danger"
          />
          <MetricCard
            title="Profit Adjustment"
            value={`KSH ${monthlyProfitAdjustment.toLocaleString()}`}
            icon={Calculator}
            iconColor="primary"
          />
        </div>

        {/* Items Picked Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <Typography variant="h4" className="mb-4">
            Items Picked by Investors
          </Typography>
          <DataTable
            data={adjustments.filter(adj => adj.type === "item_picked")}
            columns={adjustmentColumns}
            emptyMessage="No items picked recorded yet."
          />
        </div>

        {/* Expenses Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <Typography variant="h4" className="mb-4">
            Business Expenses
          </Typography>
          <DataTable
            data={expenses}
            columns={expenseColumns}
            emptyMessage="No expenses recorded yet."
          />
        </div>

        {/* Item Picked Form Modal */}
        {showItemPickedForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 w-full max-w-md">
              <div className="p-6">
                <Typography variant="h4" className="mb-4">
                  Record Item Picked
                </Typography>
                <form onSubmit={handleItemPickedSubmit} className="space-y-4">
                  {errors.general && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                      <Typography variant="small" className="text-red-800">
                        {errors.general}
                      </Typography>
                    </div>
                  )}

                  <FormGroup label="Item" required error={errors.inventoryItemId}>
                    <select
                      value={itemPickedData.inventoryItemId}
                      onChange={(e) => setItemPickedData(prev => ({ ...prev, inventoryItemId: e.target.value }))}
                      className="flex h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm"
                    >
                      <option value="">Select an item</option>
                      {items.map(item => (
                        <option key={item.id} value={item.id}>
                          {item.name} (KSH {item.unitCost})
                        </option>
                      ))}
                    </select>
                  </FormGroup>

                  <FormGroup label="Quantity" required error={errors.quantity}>
                    <Input
                      type="number"
                      placeholder="0"
                      value={itemPickedData.quantity}
                      onChange={(e) => setItemPickedData(prev => ({ ...prev, quantity: e.target.value }))}
                    />
                  </FormGroup>

                  <FormGroup label="Date" required>
                    <Input
                      type="date"
                      value={itemPickedData.date}
                      onChange={(e) => setItemPickedData(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </FormGroup>

                  <FormGroup label="Description">
                    <Input
                      placeholder="Optional description"
                      value={itemPickedData.description}
                      onChange={(e) => setItemPickedData(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </FormGroup>

                  <div className="flex gap-3 pt-4">
                    <Button type="submit" disabled={isSubmitting} className="flex-1">
                      {isSubmitting ? "Recording..." : "Record"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowItemPickedForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Expense Form Modal */}
        {showExpenseForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 w-full max-w-md">
              <div className="p-6">
                <Typography variant="h4" className="mb-4">
                  Add Business Expense
                </Typography>
                <form onSubmit={handleExpenseSubmit} className="space-y-4">
                  {errors.general && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                      <Typography variant="small" className="text-red-800">
                        {errors.general}
                      </Typography>
                    </div>
                  )}

                  <FormGroup label="Category" required error={errors.category}>
                    <Input
                      placeholder="e.g., Office Supplies, Transport, etc."
                      value={expenseData.category}
                      onChange={(e) => setExpenseData(prev => ({ ...prev, category: e.target.value }))}
                    />
                  </FormGroup>

                  <FormGroup label="Amount (KSH)" required error={errors.amount}>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={expenseData.amount}
                      onChange={(e) => setExpenseData(prev => ({ ...prev, amount: e.target.value }))}
                    />
                  </FormGroup>

                  <FormGroup label="Date" required>
                    <Input
                      type="date"
                      value={expenseData.date}
                      onChange={(e) => setExpenseData(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </FormGroup>

                  <FormGroup label="Description">
                    <Input
                      placeholder="Optional description"
                      value={expenseData.description}
                      onChange={(e) => setExpenseData(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </FormGroup>

                  <div className="flex gap-3 pt-4">
                    <Button type="submit" disabled={isSubmitting} className="flex-1">
                      {isSubmitting ? "Adding..." : "Add Expense"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowExpenseForm(false)}>
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
