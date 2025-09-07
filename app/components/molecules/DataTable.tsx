import * as React from "react"
import { cn } from "@/lib/utils"
import { Typography } from "../atoms/Typography"

export interface Column<T> {
  key: keyof T | string
  header: string
  render?: (value: unknown, row: T) => React.ReactNode
  className?: string
}

export interface DataTableProps<T = Record<string, unknown>> {
  data: T[]
  columns: Column<T>[]
  className?: string
  emptyMessage?: string
  onRowClick?: (row: T) => void
}

function DataTable<T = Record<string, unknown>>({
  data,
  columns,
  className,
  emptyMessage = "No data available",
  onRowClick,
}: DataTableProps<T>) {
  return (
    <div className={cn("rounded-2xl border border-slate-200 shadow-sm overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={cn(
                    "px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider",
                    column.className
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-8 text-center text-slate-500"
                >
                  <Typography variant="muted">{emptyMessage}</Typography>
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={cn(
                    "hover:bg-slate-50 transition-colors",
                    onRowClick && "cursor-pointer"
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column, colIndex) => {
                    const value = typeof column.key === 'string' && column.key.includes('.') 
                      ? (() => {
                          const keys = column.key.split('.')
                          let result: unknown = row
                          for (const key of keys) {
                            result = (result as Record<string, unknown>)?.[key]
                          }
                          return result
                        })()
                      : row[column.key as keyof T]
                    
                    return (
                      <td
                        key={colIndex}
                        className={cn(
                          "px-6 py-4 whitespace-nowrap text-sm text-slate-900",
                          column.className
                        )}
                      >
                        {column.render ? column.render(value, row) : String(value ?? '')}
                      </td>
                    )
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export { DataTable }
