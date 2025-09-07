import useSWR from "swr"

export interface Expense extends Record<string, unknown> {
  id: string
  date: string
  category: string
  description?: string | null
  amount: number
  createdAt: string
  updatedAt: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useExpenses(startDate?: string, endDate?: string, category?: string) {
  const params = new URLSearchParams()
  if (startDate) params.append("startDate", startDate)
  if (endDate) params.append("endDate", endDate)
  if (category) params.append("category", category)
  
  const url = `/api/expenses${params.toString() ? `?${params.toString()}` : ""}`
  
  const { data, error, isLoading, mutate } = useSWR<Expense[]>(url, fetcher)

  const createExpense = async (expenseData: Omit<Expense, "id" | "createdAt" | "updatedAt">) => {
    const response = await fetch("/api/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(expenseData),
    })

    if (!response.ok) {
      throw new Error("Failed to create expense")
    }

    const newExpense = await response.json()
    mutate()
    return newExpense
  }

  const updateExpense = async (id: string, expenseData: Partial<Expense>) => {
    const response = await fetch(`/api/expenses/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(expenseData),
    })

    if (!response.ok) {
      throw new Error("Failed to update expense")
    }

    const updatedExpense = await response.json()
    mutate()
    return updatedExpense
  }

  const deleteExpense = async (id: string) => {
    const response = await fetch(`/api/expenses/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error("Failed to delete expense")
    }

    mutate()
  }

  return {
    expenses: data || [],
    isLoading,
    error,
    createExpense,
    updateExpense,
    deleteExpense,
    mutate,
  }
}
