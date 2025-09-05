import * as React from "react"
import { Package, AlertTriangle, Edit, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "../atoms/Button"
import { Icon } from "../atoms/Icon"
import { Typography } from "../atoms/Typography"

export interface InventoryItem {
  id: string
  name: string
  unitCost: number
  currentStock: number
  reorderThreshold: number
}

export interface InventoryCardProps {
  item: InventoryItem
  onEdit?: (item: InventoryItem) => void
  onDelete?: (item: InventoryItem) => void
  onAdjustStock?: (item: InventoryItem) => void
  className?: string
}

const InventoryCard = React.forwardRef<HTMLDivElement, InventoryCardProps>(
  ({ item, onEdit, onDelete, onAdjustStock, className }, ref) => {
    const isLowStock = item.currentStock <= item.reorderThreshold
    const stockPercentage = Math.min((item.currentStock / (item.reorderThreshold * 2)) * 100, 100)

    return (
      <div
        ref={ref}
        className={cn(
          "bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow",
          className
        )}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-xl",
              isLowStock ? "bg-red-100" : "bg-blue-100"
            )}>
              <Icon 
                icon={isLowStock ? AlertTriangle : Package} 
                color={isLowStock ? "danger" : "primary"}
              />
            </div>
            <div>
              <Typography variant="large" className="font-semibold">
                {item.name}
              </Typography>
              <Typography variant="muted">
                ${item.unitCost.toFixed(2)} per unit
              </Typography>
            </div>
          </div>
          
          <div className="flex gap-1">
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(item)}
                className="h-8 w-8"
              >
                <Icon icon={Edit} size="sm" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(item)}
                className="h-8 w-8 text-red-600 hover:text-red-700"
              >
                <Icon icon={Trash2} size="sm" />
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Typography variant="small" className="font-medium">
              Current Stock
            </Typography>
            <Typography 
              variant="small" 
              className={cn(
                "font-semibold",
                isLowStock ? "text-red-600" : "text-green-600"
              )}
            >
              {item.currentStock} units
            </Typography>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className={cn(
                "h-2 rounded-full transition-all",
                isLowStock ? "bg-red-500" : "bg-green-500"
              )}
              style={{ width: `${stockPercentage}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-xs text-slate-500">
            <span>Reorder at: {item.reorderThreshold}</span>
            <span>{stockPercentage.toFixed(0)}%</span>
          </div>

          {isLowStock && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <Typography variant="small" className="text-red-800 font-medium">
                Low Stock Alert
              </Typography>
              <Typography variant="muted" className="text-red-600 text-xs">
                Stock is below reorder threshold
              </Typography>
            </div>
          )}

          {onAdjustStock && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAdjustStock(item)}
              className="w-full mt-4"
            >
              Adjust Stock
            </Button>
          )}
        </div>
      </div>
    )
  }
)
InventoryCard.displayName = "InventoryCard"

export { InventoryCard }
