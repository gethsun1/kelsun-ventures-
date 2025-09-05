"use client"

import * as React from "react"
import { Plus, Search, AlertTriangle, Edit, Trash2 } from "lucide-react"
import { DashboardLayout } from "../components/templates/DashboardLayout"
import { Typography } from "../components/atoms/Typography"
import { Button } from "../components/atoms/Button"
import { Input } from "../components/atoms/Input"
import { Icon } from "../components/atoms/Icon"
import { DataTable, Column } from "../components/molecules/DataTable"
import { InventoryModal } from "../components/organisms/InventoryModal"
import { useInventory, InventoryItem } from "../hooks/useInventory"

export default function InventoryPage() {
  const { items, isLoading, createItem, updateItem, deleteItem } = useInventory()
  const [searchTerm, setSearchTerm] = React.useState("")
  const [modalOpen, setModalOpen] = React.useState(false)
  const [modalMode, setModalMode] = React.useState<"create" | "edit">("create")
  const [selectedItem, setSelectedItem] = React.useState<InventoryItem | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const filteredItems = React.useMemo(() => {
    return items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [items, searchTerm])

  const lowStockItems = React.useMemo(() => {
    return items.filter(item => item.currentStock <= item.reorderThreshold)
  }, [items])

  const handleCreateItem = () => {
    setModalMode("create")
    setSelectedItem(null)
    setModalOpen(true)
  }

  const handleEditItem = (item: InventoryItem) => {
    setModalMode("edit")
    setSelectedItem(item)
    setModalOpen(true)
  }

  const handleDeleteItem = async (item: InventoryItem) => {
    if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
      try {
        await deleteItem(item.id)
      } catch (error) {
        alert("Failed to delete item")
      }
    }
  }

  const handleModalSubmit = async (data: Omit<InventoryItem, "id" | "createdAt" | "updatedAt">) => {
    setIsSubmitting(true)
    try {
      if (modalMode === "create") {
        await createItem(data)
      } else if (selectedItem) {
        await updateItem(selectedItem.id, data)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const columns: Column<InventoryItem>[] = [
    {
      key: "name",
      header: "Item Name",
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <Typography variant="small" className="font-medium">
            {value}
          </Typography>
          {row.currentStock <= row.reorderThreshold && (
            <Icon icon={AlertTriangle} size="sm" color="warning" />
          )}
        </div>
      ),
    },
    {
      key: "unitCost",
      header: "Unit Cost",
      render: (value) => `KSH ${value.toFixed(2)}`,
    },
    {
      key: "currentStock",
      header: "Current Stock",
      render: (value, row) => (
        <span className={row.currentStock <= row.reorderThreshold ? "text-red-600 font-medium" : ""}>
          {value} units
        </span>
      ),
    },
    {
      key: "reorderThreshold",
      header: "Reorder At",
      render: (value) => `${value} units`,
    },
    {
      key: "actions",
      header: "Actions",
      render: (_, row) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEditItem(row)}
            className="h-8 w-8"
          >
            <Icon icon={Edit} size="sm" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDeleteItem(row)}
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
              Inventory Management
            </Typography>
            <Typography variant="muted">
              Track stock levels, manage items, and monitor reorder thresholds.
            </Typography>
          </div>
          <Button onClick={handleCreateItem}>
            <Icon icon={Plus} size="sm" />
            Add New Item
          </Button>
        </div>

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <Icon icon={AlertTriangle} color="warning" />
              <Typography variant="large" className="font-semibold text-yellow-800">
                Low Stock Alert
              </Typography>
            </div>
            <Typography variant="muted" className="text-yellow-700">
              {lowStockItems.length} item{lowStockItems.length > 1 ? "s" : ""} {lowStockItems.length > 1 ? "are" : "is"} below reorder threshold
            </Typography>
          </div>
        )}

        {/* Search and Filters */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Input
              placeholder="Search items..."
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
        </div>

        {/* Inventory Table */}
        <DataTable
          data={filteredItems}
          columns={columns}
          emptyMessage={
            isLoading
              ? "Loading inventory..."
              : searchTerm
              ? "No items match your search"
              : "No inventory items found. Add your first item to get started."
          }
        />

        {/* Modal */}
        <InventoryModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleModalSubmit}
          initialData={selectedItem || undefined}
          mode={modalMode}
          isLoading={isSubmitting}
        />
      </div>
    </DashboardLayout>
  )
}
