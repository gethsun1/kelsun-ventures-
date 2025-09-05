"use client"

import * as React from "react"
import { X, Package } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "../atoms/Button"
import { Input } from "../atoms/Input"
import { Icon } from "../atoms/Icon"
import { Typography } from "../atoms/Typography"
import { FormGroup } from "../molecules/FormGroup"
import { InventoryItem } from "@/app/hooks/useInventory"

export interface InventoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Omit<InventoryItem, "id" | "createdAt" | "updatedAt">) => Promise<void>
  initialData?: Partial<InventoryItem>
  mode: "create" | "edit"
  isLoading?: boolean
}

const InventoryModal = React.forwardRef<HTMLDivElement, InventoryModalProps>(
  ({ isOpen, onClose, onSubmit, initialData, mode, isLoading }, ref) => {
    const [formData, setFormData] = React.useState({
      name: "",
      unitCost: "",
      currentStock: "",
      reorderThreshold: "10",
    })
    const [errors, setErrors] = React.useState<Record<string, string>>({})

    React.useEffect(() => {
      if (isOpen) {
        setFormData({
          name: initialData?.name || "",
          unitCost: initialData?.unitCost?.toString() || "",
          currentStock: initialData?.currentStock?.toString() || "",
          reorderThreshold: initialData?.reorderThreshold?.toString() || "10",
        })
        setErrors({})
      }
    }, [isOpen, initialData])

    const handleInputChange = (field: string, value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }))
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: "" }))
      }
    }

    const validateForm = (): boolean => {
      const newErrors: Record<string, string> = {}

      if (!formData.name.trim()) {
        newErrors.name = "Item name is required"
      }

      if (!formData.unitCost || parseFloat(formData.unitCost) <= 0) {
        newErrors.unitCost = "Unit cost must be greater than 0"
      }

      if (!formData.currentStock || parseInt(formData.currentStock) < 0) {
        newErrors.currentStock = "Current stock must be 0 or greater"
      }

      if (!formData.reorderThreshold || parseInt(formData.reorderThreshold) < 0) {
        newErrors.reorderThreshold = "Reorder threshold must be 0 or greater"
      }

      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      
      if (!validateForm()) return

      try {
        await onSubmit({
          name: formData.name.trim(),
          unitCost: parseFloat(formData.unitCost),
          currentStock: parseInt(formData.currentStock),
          reorderThreshold: parseInt(formData.reorderThreshold),
        })
        onClose()
      } catch (error) {
        setErrors({ general: "Failed to save item. Please try again." })
      }
    }

    if (!isOpen) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div
          ref={ref}
          className={cn(
            "bg-white rounded-2xl shadow-lg border border-slate-200 w-full max-w-md max-h-[90vh] overflow-y-auto"
          )}
        >
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-xl">
                <Icon icon={Package} color="primary" />
              </div>
              <Typography variant="h4">
                {mode === "create" ? "Add New Item" : "Edit Item"}
              </Typography>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon icon={X} />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                <Typography variant="small" className="text-red-800">
                  {errors.general}
                </Typography>
              </div>
            )}

            <FormGroup label="Item Name" required error={errors.name}>
              <Input
                placeholder="Enter item name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </FormGroup>

            <FormGroup label="Unit Cost (KSH)" required error={errors.unitCost}>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.unitCost}
                onChange={(e) => handleInputChange("unitCost", e.target.value)}
              />
            </FormGroup>

            <FormGroup label="Current Stock" required error={errors.currentStock}>
              <Input
                type="number"
                placeholder="0"
                value={formData.currentStock}
                onChange={(e) => handleInputChange("currentStock", e.target.value)}
              />
            </FormGroup>

            <FormGroup label="Reorder Threshold" required error={errors.reorderThreshold}>
              <Input
                type="number"
                placeholder="10"
                value={formData.reorderThreshold}
                onChange={(e) => handleInputChange("reorderThreshold", e.target.value)}
              />
            </FormGroup>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? "Saving..." : mode === "create" ? "Add Item" : "Update Item"}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    )
  }
)
InventoryModal.displayName = "InventoryModal"

export { InventoryModal }
