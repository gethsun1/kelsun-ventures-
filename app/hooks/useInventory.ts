import useSWR from "swr"

export interface InventoryItem extends Record<string, unknown> {
  id: string
  name: string
  unitCost: number
  currentStock: number
  reorderThreshold: number
  createdAt: string
  updatedAt: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useInventory() {
  const { data, error, isLoading, mutate } = useSWR<InventoryItem[]>(
    "/api/inventory",
    fetcher
  )

  const createItem = async (itemData: Omit<InventoryItem, "id" | "createdAt" | "updatedAt">) => {
    const response = await fetch("/api/inventory", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(itemData),
    })

    if (!response.ok) {
      throw new Error("Failed to create item")
    }

    const newItem = await response.json()
    mutate()
    return newItem
  }

  const updateItem = async (id: string, itemData: Partial<InventoryItem>) => {
    const response = await fetch(`/api/inventory/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(itemData),
    })

    if (!response.ok) {
      throw new Error("Failed to update item")
    }

    const updatedItem = await response.json()
    mutate()
    return updatedItem
  }

  const deleteItem = async (id: string) => {
    const response = await fetch(`/api/inventory/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error("Failed to delete item")
    }

    mutate()
  }

  return {
    items: data || [],
    isLoading,
    error,
    createItem,
    updateItem,
    deleteItem,
    mutate,
  }
}
