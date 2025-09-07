"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react"
import { AuthLayout } from "@/app/components/templates/AuthLayout"
import { Button } from "@/app/components/atoms/Button"
import { Input } from "@/app/components/atoms/Input"
import { Icon } from "@/app/components/atoms/Icon"
import { Typography } from "@/app/components/atoms/Typography"
import { FormGroup } from "@/app/components/molecules/FormGroup"

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      if (response.ok) {
        router.push("/login?message=Registration successful! Please sign in.")
      } else {
        const data = await response.json()
        setErrors({ general: data.error || "Registration failed" })
      }
    } catch {
      setErrors({ general: "An error occurred. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join KelSun Ventures and start managing your business"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3">
            <Typography variant="small" className="text-red-800">
              {errors.general}
            </Typography>
          </div>
        )}

        <FormGroup label="Full Name" required error={errors.name}>
          <div className="relative">
            <Input
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="pl-10"
            />
            <Icon
              icon={User}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
              size="sm"
            />
          </div>
        </FormGroup>

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
              placeholder="Create a password"
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

        <FormGroup label="Confirm Password" required error={errors.confirmPassword}>
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
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
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Icon icon={showConfirmPassword ? EyeOff : Eye} size="sm" />
            </Button>
          </div>
        </FormGroup>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Creating account..." : "Create Account"}
        </Button>

        <div className="text-center">
          <Typography variant="muted">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-900 hover:underline font-medium">
              Sign in
            </Link>
          </Typography>
        </div>
      </form>
    </AuthLayout>
  )
}
