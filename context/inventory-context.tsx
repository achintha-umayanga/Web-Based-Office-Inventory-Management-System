"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/components/ui/use-toast"

// Define types
export interface InventoryItem {
  id: string
  name: string
  category: string
  initialStock: number
  currentStock: number
}

export interface PurchaseLog {
  id: string
  date: string
  itemId: string
  itemName: string
  category: string
  quantity: number
}

export interface UsageLog {
  id: string
  date: string
  itemId: string
  itemName: string
  category: string
  quantity: number
}

interface InventoryContextType {
  inventory: InventoryItem[]
  purchases: PurchaseLog[]
  usages: UsageLog[]
  addInventoryItem: (item: Omit<InventoryItem, "id">) => void
  updateInventoryItem: (id: string, item: Partial<InventoryItem>) => void
  deleteInventoryItem: (id: string) => void
  addPurchase: (purchase: Omit<PurchaseLog, "id">) => void
  addUsage: (usage: Omit<UsageLog, "id">) => void
  getInventoryItem: (id: string) => InventoryItem | undefined
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined)

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [purchases, setPurchases] = useState<PurchaseLog[]>([])
  const [usages, setUsages] = useState<UsageLog[]>([])
  const { toast } = useToast()

  // Load data from localStorage on mount
  useEffect(() => {
    const loadedInventory = localStorage.getItem("inventory")
    const loadedPurchases = localStorage.getItem("purchases")
    const loadedUsages = localStorage.getItem("usage")

    if (loadedInventory) setInventory(JSON.parse(loadedInventory))
    if (loadedPurchases) setPurchases(JSON.parse(loadedPurchases))
    if (loadedUsages) setUsages(JSON.parse(loadedUsages))

    // If no data exists, initialize with sample data
    if (!loadedInventory) {
      const sampleInventory: InventoryItem[] = [
        {
          id: "1",
          name: "Printer Paper",
          category: "Office Supplies",
          initialStock: 50,
          currentStock: 50,
        },
        {
          id: "2",
          name: "Ballpoint Pens",
          category: "Office Supplies",
          initialStock: 100,
          currentStock: 100,
        },
        {
          id: "3",
          name: "Notebooks",
          category: "Office Supplies",
          initialStock: 30,
          currentStock: 30,
        },
        {
          id: "4",
          name: "Staplers",
          category: "Office Equipment",
          initialStock: 10,
          currentStock: 10,
        },
        {
          id: "5",
          name: "Desk Chairs",
          category: "Furniture",
          initialStock: 5,
          currentStock: 5,
        },
      ]
      setInventory(sampleInventory)
      localStorage.setItem("inventory", JSON.stringify(sampleInventory))
    }
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("inventory", JSON.stringify(inventory))
  }, [inventory])

  useEffect(() => {
    localStorage.setItem("purchases", JSON.stringify(purchases))
  }, [purchases])

  useEffect(() => {
    localStorage.setItem("usage", JSON.stringify(usages))
  }, [usages])

  // Add a new inventory item
  const addInventoryItem = (item: Omit<InventoryItem, "id">) => {
    const newItem = {
      ...item,
      id: Date.now().toString(),
    }
    setInventory([...inventory, newItem])
    toast({
      title: "Item Added",
      description: `${item.name} has been added to inventory.`,
    })
  }

  // Update an existing inventory item
  const updateInventoryItem = (id: string, updatedFields: Partial<InventoryItem>) => {
    setInventory(inventory.map((item) => (item.id === id ? { ...item, ...updatedFields } : item)))
    toast({
      title: "Item Updated",
      description: "The inventory item has been updated.",
    })
  }

  // Delete an inventory item
  const deleteInventoryItem = (id: string) => {
    const itemToDelete = inventory.find((item) => item.id === id)
    if (!itemToDelete) return

    setInventory(inventory.filter((item) => item.id !== id))
    toast({
      title: "Item Deleted",
      description: `${itemToDelete.name} has been removed from inventory.`,
    })
  }

  // Add a purchase log and update inventory
  const addPurchase = (purchase: Omit<PurchaseLog, "id">) => {
    const newPurchase = {
      ...purchase,
      id: Date.now().toString(),
    }

    setPurchases([...purchases, newPurchase])

    // Update inventory item stock
    const itemIndex = inventory.findIndex((item) => item.id === purchase.itemId)

    if (itemIndex !== -1) {
      const updatedInventory = [...inventory]
      updatedInventory[itemIndex] = {
        ...updatedInventory[itemIndex],
        currentStock: updatedInventory[itemIndex].currentStock + purchase.quantity,
      }
      setInventory(updatedInventory)
    }

    toast({
      title: "Purchase Logged",
      description: `Added ${purchase.quantity} units of ${purchase.itemName}.`,
    })
  }

  // Add a usage log and update inventory
  const addUsage = (usage: Omit<UsageLog, "id">) => {
    const newUsage = {
      ...usage,
      id: Date.now().toString(),
    }

    setUsages([...usages, newUsage])

    // Update inventory item stock
    const itemIndex = inventory.findIndex((item) => item.id === usage.itemId)

    if (itemIndex !== -1) {
      const updatedInventory = [...inventory]
      updatedInventory[itemIndex] = {
        ...updatedInventory[itemIndex],
        currentStock: Math.max(0, updatedInventory[itemIndex].currentStock - usage.quantity),
      }
      setInventory(updatedInventory)
    }

    toast({
      title: "Usage Logged",
      description: `Recorded usage of ${usage.quantity} units of ${usage.itemName}.`,
    })
  }

  // Get a specific inventory item by ID
  const getInventoryItem = (id: string) => {
    return inventory.find((item) => item.id === id)
  }

  return (
    <InventoryContext.Provider
      value={{
        inventory,
        purchases,
        usages,
        addInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        addPurchase,
        addUsage,
        getInventoryItem,
      }}
    >
      {children}
    </InventoryContext.Provider>
  )
}

export function useInventory() {
  const context = useContext(InventoryContext)
  if (context === undefined) {
    throw new Error("useInventory must be used within an InventoryProvider")
  }
  return context
}
