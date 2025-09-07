import useSWR from "swr"

export interface Investment extends Record<string, unknown> {
  id: string
  investorName: string
  startDate: string
  capital: number
  currentProfit: number
  profitShare: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useInvestments() {
  const { data, error, isLoading, mutate } = useSWR<Investment[]>(
    "/api/investments",
    fetcher
  )

  const createInvestment = async (investmentData: Omit<Investment, "id" | "currentProfit" | "isActive" | "createdAt" | "updatedAt">) => {
    const response = await fetch("/api/investments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(investmentData),
    })

    if (!response.ok) {
      throw new Error("Failed to create investment")
    }

    const newInvestment = await response.json()
    mutate()
    return newInvestment
  }

  return {
    investments: data || [],
    isLoading,
    error,
    createInvestment,
    mutate,
  }
}
