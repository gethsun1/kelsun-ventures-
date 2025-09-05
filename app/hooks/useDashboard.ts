import useSWR from "swr"

export interface DashboardMetrics {
  totalInvestments: number
  totalInvestmentsChange: number
  lowStockItems: number
  lowStockItemsChange: number
  todayMpesaNetFlow: number
  todayMpesaNetFlowChange: number
  monthlyProfitShare: number
  monthlyProfitShareChange: number
}

export interface ChartData {
  earningsData: Array<{
    month: string
    earnings: number
    expenses: number
  }>
  mpesaData: Array<{
    day: string
    deposits: number
    withdrawals: number
  }>
}

export interface DashboardData {
  metrics: DashboardMetrics
  charts: ChartData
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useDashboard() {
  const { data, error, isLoading, mutate } = useSWR<DashboardData>(
    "/api/dashboard",
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
    }
  )

  return {
    data: data || {
      metrics: {
        totalInvestments: 0,
        totalInvestmentsChange: 0,
        lowStockItems: 0,
        lowStockItemsChange: 0,
        todayMpesaNetFlow: 0,
        todayMpesaNetFlowChange: 0,
        monthlyProfitShare: 0,
        monthlyProfitShareChange: 0,
      },
      charts: {
        earningsData: [],
        mpesaData: [],
      },
    },
    isLoading,
    error,
    mutate,
  }
}

