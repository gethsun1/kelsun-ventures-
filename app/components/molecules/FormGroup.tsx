import * as React from "react"
import { cn } from "@/lib/utils"
import { Typography } from "../atoms/Typography"

export interface FormGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
  error?: string
  required?: boolean
  children: React.ReactNode
}

const FormGroup = React.forwardRef<HTMLDivElement, FormGroupProps>(
  ({ className, label, error, required, children, ...props }, ref) => {
    return (
      <div className={cn("space-y-2", className)} ref={ref} {...props}>
        {label && (
          <Typography
            variant="small"
            as="label"
            className={cn(
              "font-medium text-slate-900",
              required && "after:content-['*'] after:ml-0.5 after:text-red-500"
            )}
          >
            {label}
          </Typography>
        )}
        {children}
        {error && (
          <Typography variant="small" className="text-red-600">
            {error}
          </Typography>
        )}
      </div>
    )
  }
)
FormGroup.displayName = "FormGroup"

export { FormGroup }
