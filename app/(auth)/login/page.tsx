"use client"

import * as React from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import { AuthLayout } from "@/app/components/templates/AuthLayout"
import { Button } from "@/app/components/atoms/Button"
import { Input } from "@/app/components/atoms/Input"
import { Icon } from "@/app/components/atoms/Icon"
import { Typography } from "@/app/components/atoms/Typography"
import { FormGroup } from "@/app/components/molecules/FormGroup"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        setErrors({ general: "Invalid email or password" })
      } else {
        router.push("/dashboard")
      }
    } catch {
      setErrors({ general: "An error occurred. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }



  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your KelSun Ventures account"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3">
            <Typography variant="small" className="text-red-800">
              {errors.general}
            </Typography>
          </div>
        )}

        <FormGroup label="Email" required error={errors.email}>
          <div className="relative">
            <Input
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="pl-10"
            />
            <Icon
              icon={Mail}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
              size="sm"
            />
          </div>
        </FormGroup>

        <FormGroup label="Password" required error={errors.password}>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="pl-10 pr-10"
            />
            <Icon
              icon={Lock}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
              size="sm"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
              onClick={() => setShowPassword(!showPassword)}
            >
              <Icon icon={showPassword ? EyeOff : Eye} size="sm" />
            </Button>
          </div>
        </FormGroup>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>

        <div className="text-center">
          <Typography variant="muted">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-blue-900 hover:underline font-medium">
              Sign up
            </Link>
          </Typography>
        </div>
      </form>
    </AuthLayout>
  )
}
