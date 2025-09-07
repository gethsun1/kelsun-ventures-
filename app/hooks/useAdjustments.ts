import useSWR from "swr"

export interface Adjustment extends Record<string, unknown> {
  id: string
  type: string
  date: string
  description?: string | null
  amount?: number | null
  quantity?: number | null
  inventoryItemId?: string | null
  inventoryItem?: {
    id: string
    name: string
    unitCost: number
  } | null
  createdAt: string
  updatedAt: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useAdjustments(type?: string, startDate?: string, endDate?: string) {
  const params = new URLSearchParams()
  if (type) params.append("type", type)
  if (startDate) params.append("startDate", startDate)
  if (endDate) params.append("endDate", endDate)
  
  const url = `/api/adjustments${params.toString() ? `?${params.toString()}` : ""}`
  
  const { data, error, isLoading, mutate } = useSWR<Adjustment[]>(url, fetcher)

  const createAdjustment = async (adjustmentData: Omit<Adjustment, "id" | "createdAt" | "updatedAt" | "inventoryItem">) => {
    const response = await fetch("/api/adjustments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(adjustmentData),
    })

    if (!response.ok) {
      throw new Error("Failed to create adjustment")
    }

    const newAdjustment = await response.json()
    mutate()
    return newAdjustment
  }

  return {
    adjustments: data || [],
    isLoading,
    error,
    createAdjustment,
    mutate,
  }
}
