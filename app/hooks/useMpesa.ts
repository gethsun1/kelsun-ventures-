import useSWR from "swr"

export interface MpesaEntry extends Record<string, unknown> {
  id: string
  date: string
  type: "start_of_day" | "end_of_day"
  startingFloat?: number | null
  deposits?: number | null
  withdrawals?: number | null
  fees?: number | null
  endingFloat?: number | null
  netChange?: number | null
  createdAt: string
  updatedAt: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useMpesa(startDate?: string, endDate?: string) {
  const params = new URLSearchParams()
  if (startDate) params.append("startDate", startDate)
  if (endDate) params.append("endDate", endDate)
  
  const url = `/api/mpesa${params.toString() ? `?${params.toString()}` : ""}`
  
  const { data, error, isLoading, mutate } = useSWR<MpesaEntry[]>(url, fetcher)

  const createEntry = async (entryData: Omit<MpesaEntry, "id" | "createdAt" | "updatedAt" | "netChange">) => {
    const response = await fetch("/api/mpesa", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(entryData),
    })

    if (!response.ok) {
      throw new Error("Failed to create M-Pesa entry")
    }

    const newEntry = await response.json()
    mutate()
    return newEntry
  }

  return {
    entries: data || [],
    isLoading,
    error,
    createEntry,
    mutate,
  }
}
