import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/lib/auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get current date and previous month for comparisons
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

    // Calculate Total Investments
    const [currentInvestments, previousInvestments] = await Promise.all([
      prisma.investment.aggregate({
        where: { isActive: true },
        _sum: { capital: true }
      }),
      prisma.investment.findMany({
        where: {
          isActive: true,
          createdAt: {
            gte: lastMonth,
            lte: lastMonthEnd
          }
        }
      })
    ])

    const totalInvestments = currentInvestments._sum.capital || 0
    const previousTotalInvestments = previousInvestments.reduce((sum, inv) => sum + inv.capital, 0)
    const totalInvestmentsChange = previousTotalInvestments > 0 
      ? ((totalInvestments - previousTotalInvestments) / previousTotalInvestments) * 100 
      : 0

    // Calculate Low Stock Items
    const [currentLowStock] = await Promise.all([
      prisma.inventoryItem.count({
        where: {
          currentStock: {
            lte: prisma.inventoryItem.fields.reorderThreshold
          }
        }
      }),
      // For simplicity, we'll use current count as previous (you can enhance this)
      prisma.inventoryItem.count({
        where: {
          currentStock: {
            lte: prisma.inventoryItem.fields.reorderThreshold
          }
        }
      })
    ])

    const lowStockItems = currentLowStock
    const lowStockItemsChange = 0 // You can implement proper tracking

    // Calculate Today's M-Pesa Net Flow
    const [todayMpesaEntries, yesterdayMpesaEntries] = await Promise.all([
      prisma.mpesaEntry.findMany({
        where: {
          date: {
            gte: today,
            lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
          },
          type: "end_of_day"
        }
      }),
      prisma.mpesaEntry.findMany({
        where: {
          date: {
            gte: yesterday,
            lt: today
          },
          type: "end_of_day"
        }
      })
    ])

    const todayMpesaNetFlow = todayMpesaEntries.reduce((sum, entry) => {
      if (entry.deposits && entry.withdrawals && entry.fees) {
        return sum + (entry.deposits - entry.withdrawals - entry.fees)
      }
      return sum
    }, 0)

    const yesterdayMpesaNetFlow = yesterdayMpesaEntries.reduce((sum, entry) => {
      if (entry.deposits && entry.withdrawals && entry.fees) {
        return sum + (entry.deposits - entry.withdrawals - entry.fees)
      }
      return sum
    }, 0)

    const todayMpesaNetFlowChange = yesterdayMpesaNetFlow !== 0 
      ? ((todayMpesaNetFlow - yesterdayMpesaNetFlow) / Math.abs(yesterdayMpesaNetFlow)) * 100 
      : 0

    // Calculate Monthly Profit Share
    const [currentMonthInvestments, previousMonthInvestments] = await Promise.all([
      prisma.investment.findMany({
        where: {
          isActive: true,
          createdAt: { gte: thisMonth }
        }
      }),
      prisma.investment.findMany({
        where: {
          isActive: true,
          createdAt: {
            gte: lastMonth,
            lte: lastMonthEnd
          }
        }
      })
    ])

    const monthlyProfitShare = currentMonthInvestments.reduce((sum, inv) => {
      return sum + (inv.currentProfit * inv.profitShare)
    }, 0)

    const previousMonthlyProfitShare = previousMonthInvestments.reduce((sum, inv) => {
      return sum + (inv.currentProfit * inv.profitShare)
    }, 0)

    const monthlyProfitShareChange = previousMonthlyProfitShare !== 0 
      ? ((monthlyProfitShare - previousMonthlyProfitShare) / Math.abs(previousMonthlyProfitShare)) * 100 
      : 0

    // Generate Chart Data
    const earningsData = await generateEarningsChartData()
    const mpesaData = await generateMpesaChartData()

    const dashboardData = {
      metrics: {
        totalInvestments,
        totalInvestmentsChange,
        lowStockItems,
        lowStockItemsChange,
        todayMpesaNetFlow,
        todayMpesaNetFlowChange,
        monthlyProfitShare,
        monthlyProfitShareChange,
      },
      charts: {
        earningsData,
        mpesaData,
      },
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

async function generateEarningsChartData() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const currentYear = new Date().getFullYear()
  
  const earningsData = []
  
  for (let i = 0; i < 6; i++) {
    const monthIndex = new Date().getMonth() - 5 + i
    const month = months[monthIndex]
    
    const monthStart = new Date(currentYear, monthIndex, 1)
    const monthEnd = new Date(currentYear, monthIndex + 1, 0)
    
    // Calculate earnings from investments (simplified)
    const investments = await prisma.investment.findMany({
      where: {
        isActive: true,
        createdAt: {
          gte: monthStart,
          lte: monthEnd
        }
      }
    })
    
    const earnings = investments.reduce((sum, inv) => sum + inv.currentProfit, 0)
    
    // Calculate expenses
    const expenses = await prisma.expense.aggregate({
      where: {
        date: {
          gte: monthStart,
          lte: monthEnd
        }
      },
      _sum: { amount: true }
    })
    
    earningsData.push({
      month,
      earnings: earnings || 0,
      expenses: expenses._sum.amount || 0,
    })
  }
  
  return earningsData
}

async function generateMpesaChartData() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const mpesaData = []
  
  // Get last 7 days
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000)
    
    const entries = await prisma.mpesaEntry.findMany({
      where: {
        date: {
          gte: dayStart,
          lt: dayEnd
        },
        type: "end_of_day"
      }
    })
    
    const deposits = entries.reduce((sum, entry) => sum + (entry.deposits || 0), 0)
    const withdrawals = entries.reduce((sum, entry) => sum + (entry.withdrawals || 0), 0)
    
    mpesaData.push({
      day: days[date.getDay() === 0 ? 6 : date.getDay() - 1], // Convert Sunday to last day
      deposits,
      withdrawals,
    })
  }
  
  return mpesaData
}

