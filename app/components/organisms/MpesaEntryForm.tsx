"use client"

import * as React from "react"
import { Calendar, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "../atoms/Button"
import { Input } from "../atoms/Input"
import { Icon } from "../atoms/Icon"
import { Typography } from "../atoms/Typography"
import { FormGroup } from "../molecules/FormGroup"

export interface MpesaEntry {
  id?: string
  date: string
  type: "start_of_day" | "end_of_day"
  startingFloat?: number
  deposits?: number
  withdrawals?: number
  fees?: number
  endingFloat?: number
}

export interface MpesaEntryFormProps {
  type: "start_of_day" | "end_of_day"
  initialData?: Partial<MpesaEntry>
  onSubmit: (data: MpesaEntry) => void
  onCancel?: () => void
  isLoading?: boolean
  className?: string
}

const MpesaEntryForm = React.forwardRef<HTMLFormElement, MpesaEntryFormProps>(
  ({ type, initialData, onSubmit, onCancel, isLoading, className }, ref) => {
    const [formData, setFormData] = React.useState<Partial<MpesaEntry>>({
      date: new Date().toISOString().split('T')[0],
      type,
      ...initialData,
    })

    const [errors, setErrors] = React.useState<Record<string, string>>({})

    const handleInputChange = (field: keyof MpesaEntry, value: string | number) => {
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

      if (type === "start_of_day") {
        if (!formData.startingFloat || formData.startingFloat <= 0) {
          newErrors.startingFloat = "Starting float must be greater than 0"
        }
      } else {
        if (!formData.deposits || formData.deposits < 0) {
          newErrors.deposits = "Deposits must be 0 or greater"
        }
        if (!formData.withdrawals || formData.withdrawals < 0) {
          newErrors.withdrawals = "Withdrawals must be 0 or greater"
        }
        if (!formData.fees || formData.fees < 0) {
          newErrors.fees = "Fees must be 0 or greater"
        }
        if (!formData.endingFloat || formData.endingFloat < 0) {
          newErrors.endingFloat = "Ending float must be 0 or greater"
        }
      }

      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (validateForm()) {
        onSubmit(formData as MpesaEntry)
      }
    }

    return (
      <form
        ref={ref}
        onSubmit={handleSubmit}
        className={cn("space-y-6", className)}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-xl">
            <Icon icon={DollarSign} color="primary" />
          </div>
          <div>
            <Typography variant="h3">
              {type === "start_of_day" ? "Start of Day Float" : "End of Day Reconciliation"}
            </Typography>
            <Typography variant="muted">
              {type === "start_of_day" 
                ? "Record the starting M-Pesa float for the day"
                : "Record end of day transactions and final float"
              }
            </Typography>
          </div>
        </div>

        <FormGroup label="Date" required error={errors.date}>
          <Input
            type="date"
            value={formData.date || ""}
            onChange={(e) => handleInputChange("date", e.target.value)}
          />
        </FormGroup>

        {type === "start_of_day" ? (
          <FormGroup label="Starting Float (KSH)" required error={errors.startingFloat}>
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.startingFloat || ""}
              onChange={(e) => handleInputChange("startingFloat", parseFloat(e.target.value) || 0)}
            />
          </FormGroup>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormGroup label="Deposits (KSH)" required error={errors.deposits}>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.deposits || ""}
                onChange={(e) => handleInputChange("deposits", parseFloat(e.target.value) || 0)}
              />
            </FormGroup>

            <FormGroup label="Withdrawals (KSH)" required error={errors.withdrawals}>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.withdrawals || ""}
                onChange={(e) => handleInputChange("withdrawals", parseFloat(e.target.value) || 0)}
              />
            </FormGroup>

            <FormGroup label="Fees (KSH)" required error={errors.fees}>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.fees || ""}
                onChange={(e) => handleInputChange("fees", parseFloat(e.target.value) || 0)}
              />
            </FormGroup>

            <FormGroup label="Ending Float (KSH)" required error={errors.endingFloat}>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.endingFloat || ""}
                onChange={(e) => handleInputChange("endingFloat", parseFloat(e.target.value) || 0)}
              />
            </FormGroup>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? "Saving..." : "Save Entry"}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    )
  }
)
MpesaEntryForm.displayName = "MpesaEntryForm"

export { MpesaEntryForm }
