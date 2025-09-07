"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowRight, BarChart3, Package, Smartphone, TrendingUp } from "lucide-react"
import { Button } from "./components/atoms/Button"
import { Icon } from "./components/atoms/Icon"
import { Typography } from "./components/atoms/Typography"

export default function Home() {
  const { status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <Typography variant="h1" className="text-blue-900 mb-6">
            KelSun Ventures Portal
          </Typography>
          <Typography variant="lead" className="max-w-2xl mx-auto mb-8">
            Comprehensive business management platform for tracking investments,
            inventory, M-Pesa transactions, and profit-sharing calculations.
          </Typography>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/login">
                Get Started
                <Icon icon={ArrowRight} size="sm" />
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link href="/register">
                Create Account
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="p-3 bg-blue-100 rounded-xl w-fit mb-4">
              <Icon icon={BarChart3} color="primary" size="lg" />
            </div>
            <Typography variant="h4" className="mb-2">
              Dashboard Analytics
            </Typography>
            <Typography variant="muted">
              Real-time insights into your business performance with interactive charts and metrics.
            </Typography>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="p-3 bg-green-100 rounded-xl w-fit mb-4">
              <Icon icon={Package} color="success" size="lg" />
            </div>
            <Typography variant="h4" className="mb-2">
              Inventory Management
            </Typography>
            <Typography variant="muted">
              Track stock levels, manage reorder thresholds, and monitor inventory costs efficiently.
            </Typography>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="p-3 bg-yellow-100 rounded-xl w-fit mb-4">
              <Icon icon={Smartphone} color="warning" size="lg" />
            </div>
            <Typography variant="h4" className="mb-2">
              M-Pesa Tracking
            </Typography>
            <Typography variant="muted">
              Monitor daily float, track transactions, and reconcile M-Pesa operations seamlessly.
            </Typography>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="p-3 bg-purple-100 rounded-xl w-fit mb-4">
              <Icon icon={TrendingUp} color="primary" size="lg" />
            </div>
            <Typography variant="h4" className="mb-2">
              Investment Tracking
            </Typography>
            <Typography variant="muted">
              Manage investor relationships, track capital, and calculate profit-sharing distributions.
            </Typography>
          </div>
        </div>

        <div className="text-center">
          <Typography variant="muted">
            © 2024 KelSun Ventures. All rights reserved.
          </Typography>
        </div>
      </div>
    </div>
  )
}
