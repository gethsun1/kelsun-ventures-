import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const typographyVariants = cva("", {
  variants: {
    variant: {
      h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-slate-900",
      h2: "scroll-m-20 border-b border-slate-200 pb-2 text-3xl font-semibold tracking-tight text-slate-900 first:mt-0",
      h3: "scroll-m-20 text-2xl font-semibold tracking-tight text-slate-900",
      h4: "scroll-m-20 text-xl font-semibold tracking-tight text-slate-900",
      p: "leading-7 text-slate-700 [&:not(:first-child)]:mt-6",
      blockquote: "mt-6 border-l-2 border-slate-300 pl-6 italic text-slate-800",
      list: "my-6 ml-6 list-disc [&>li]:mt-2 text-slate-700",
      code: "relative rounded bg-slate-100 px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-slate-900",
      lead: "text-xl text-slate-700",
      large: "text-lg font-semibold text-slate-900",
      small: "text-sm font-medium leading-none text-slate-700",
      muted: "text-sm text-slate-500",
    },
  },
  defaultVariants: {
    variant: "p",
  },
})

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  as?: React.ElementType
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant, as, ...props }, ref) => {
    const Comp = as || getDefaultElement(variant)
    return (
      <Comp
        className={cn(typographyVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)

function getDefaultElement(variant: TypographyProps["variant"]) {
  switch (variant) {
    case "h1":
      return "h1"
    case "h2":
      return "h2"
    case "h3":
      return "h3"
    case "h4":
      return "h4"
    case "blockquote":
      return "blockquote"
    case "list":
      return "ul"
    case "code":
      return "code"
    case "lead":
    case "large":
    case "small":
    case "muted":
    case "p":
    default:
      return "p"
  }
}

Typography.displayName = "Typography"

export { Typography, typographyVariants }
