"use clint"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Item } from "@radix-ui/react-dropdown-menu";

export interface InventoryItem {
    id: string;
    name: string;
    category: string;
    startingQuantity: number;
    currentQuantity: number;
}

export interface PurchaseLog {
    id: string;
    date: string;
    itemId: string;
    itemName: string;
    category: string;
    quantity: number;
}

export interface UsageLog {
    id:string;
    date: string;
    itemId: string;
    itemName: string;
    category: string;
    quantity: number;
}

interface InventoryContextType {
    inventory: InventoryItem[];
    purchases: PurchaseLog[];
    usage: UsageLog[];
    addInventoryItem: (item: Omit<InventoryItem, "id">) => void;
    updateInventoryItem: (id: string, updatedItem: Partial<InventoryItem>) => void;
    deleteInventoryItem: (id: string) => void;
    addPurchase: (purchase: Omit<PurchaseLog, "id">) => void;
    addUsage: (usage: Omit<UsageLog, "id">) => void;
    getInventoryItem: (id: string) => InventoryItem | undefined;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined)

export function InventoryProvider({ children }: { children: ReactNode }) {
    const [inventory, setInventory] = useState<InventoryItem[]>([])
    const [purchases, setPurchases] = useState<PurchaseLog[]>([])
    const [usage, setUsages] = useState<UsageLog[]>([])
    const { toast } = useToast()

    useEffect(() => {
        const storedInventory = localStorage.getItem("inventory")
        const storedPurchases = localStorage.getItem("purchases")
        const storedUsage = localStorage.getItem("usage")

        if (storedInventory) {
            setInventory(JSON.parse(storedInventory))
        }
        if (storedPurchases) {
            setPurchases(JSON.parse(storedPurchases))
        }
        if (storedUsage) {
            setUsages(JSON.parse(storedUsage))
        }

        if (!storedInventory) {
            const sampleInventory: InventoryItem[] = [
                {
                    id: "1",
                    name: "Tea",
                    category: "kitchen Supplies",
                    startingQuantity: 5,
                    currentQuantity: 5,
                  },
                  {
                    id: "2",
                    name: "Coffee",
                    category: "kitchen Supplies",
                    startingQuantity: 3,
                    currentQuantity: 5,
                  },
                  {
                    id: "3",
                    name: "Milk Powder",
                    category: "Kitchen Supplies",
                    startingQuantity: 4,
                    currentQuantity: 4,
                  },
                  {
                    id: "4",
                    name: "Sugar",
                    category: "kitchen Equipment",
                    startingQuantity: 2,
                    currentQuantity: 2,
                  },
                  {
                    id: "5",
                    name: "Pens",
                    category: "Stationery",
                    startingQuantity: 10,
                    currentQuantity: 10,
                  },    
                  {
                    id: "6",
                    name: "Notebooks",
                    category: "Stationery",
                    startingQuantity: 15,
                    currentQuantity: 15,
                  },  
                  {
                    id: "7",
                    name: "Detergent",
                    category: "Cleaning Supplies",
                    startingQuantity: 5,
                    currentQuantity: 7,
                  },  
            ]
            setInventory(sampleInventory)
            localStorage.setItem("inventory", JSON.stringify(sampleInventory))
        }
    }, [])


    //save data to the localstorage
    useEffect(() => {
        localStorage.setItem("inventory", JSON.stringify(inventory))
    }, [inventory])

    useEffect(() => {
        localStorage.setItem("purchases", JSON.stringify(purchases))
    }, [purchases])

    useEffect(() => {
        localStorage.setItem("usage", JSON.stringify(usage))
    }, [usage])

    //adding new inventory items
    const addInventoryItem = (item: Omit<InventoryItem, "id">) => {
        const newItem = {
            ...item,
            id: Date.now().toString(),
        }

        setInventory([...inventory, newItem])
        toast({
            title: "Item Added",
            description: `${item.name} has been added to the inventory.`,
        })
    }

    //updating inventory items
    const updateInventoryItem = (id: string, updatedItem: Partial<InventoryItem>) => {
        setInventory(inventory.map((item) => (item.id === id ? { ...item, ...updatedItem } : item)))
        toast({
            title: "Item Updated",
            description: `${updatedItem.name} has been updated.`,
        })
    }

    //deleting inventory items
    const deleteInventoryItem = (id: string) => {
        const itemToDelete = inventory.find((item) => item.id === id)
        if (!itemToDelete) return
    
        setInventory(inventory.filter((item) => item.id !== id))
        toast({
          title: "Item Deleted",
          description: `${itemToDelete.name} has been removed from inventory.`,
        })
    }

    //adding purchase logs
    const addPurchase = (purchase: Omit<PurchaseLog, "id">) => {
        const newPurchase = {
            ...purchase,
            id: Date.now().toString(),
        }

        setPurchases([...purchases, newPurchase])

        //updating inventory quantity
        const itemIndex = inventory.findIndex((item) => item.id === purchase.itemId)

        if (itemIndex !== -1) {
            const updatedInventory = [...inventory]
            updatedInventory[itemIndex] = {
                ...updatedInventory[itemIndex],
                currentQuantity: updatedInventory[itemIndex].currentQuantity + purchase.quantity,
            }
            setInventory(updatedInventory)
        }

        toast({
            title: "Purchase Added",
            description: `Purchased ${purchase.quantity} units of ${purchase.itemName}.`,
        })
    }

    //adding usage logs
    const addUsage = (usage: Omit<UsageLog, "id">) => {
        const newUsage = {
            ...usage,
            id: Date.now().toString(),
        }

        setUsages([...usages, newUsage])

        //updating inventory quantity
        const itemIndex = inventory.findIndex((item) => item.id === usage.itemId)

        if (itemIndex !== -1) {
            const updatedInventory = [...inventory]
            updatedInventory[itemIndex] = {
                ...updatedInventory[itemIndex],
                currentQuantity: updatedInventory[itemIndex].currentQuantity - usage.quantity,
            }
            setInventory(updatedInventory)
        }

        toast({
            title: "Usage Added",
            description: `Used ${usage.quantity} units of ${usage.itemName}.`,
        })
    }

    //getting inventory item by id\
    const getInventoryItem = (id: string) => {
        return inventory.find((item) => item.id === id)
    }

    return (
        <InventoryContext.Provider
            value={{
                inventory,
                purchases,
                usage,
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