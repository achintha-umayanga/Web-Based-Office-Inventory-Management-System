"use client"

import { useState } from "react"
import { useInventory, type PurchaseLog } from "@/context/inventory-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"


export function PurchasesPage() {
  const { inventory, purchases, addPurchase } = useInventory()
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<keyof PurchaseLog>("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newPurchase, setNewPurchase] = useState({
    date: new Date().toISOString().split("T")[0],
    itemId: "",
    quantity: 0,
  })

  const [errors, setErrors] = useState({
    itemId: false,
    quantity: false,
  })

  // Filter and sort purchases
  const filteredPurchases = purchases.filter(
    (purchase) =>
      purchase.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  //sort purchases
  const sortedPurchases = filteredPurchases.sort((a, b) => {
    if (sortField === "date") {
      return sortDirection === "asc"
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime()
    }

    if (a[sortField] < b[sortField]) return sortDirection === "asc" ? -1 : 1
    if (a[sortField] > b[sortField]) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  // Handle sort field change
  const handleSort = (field: keyof PurchaseLog) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection(field === "date" ? "desc" : "asc")
    }
  }

  // Handle add purchase dialog
  const handleAddPurchase = () => {
    const newErrors = {
      itemId: !newPurchase.itemId,
      quantity: newPurchase.quantity <= 0,
    }

    setErrors(newErrors)

    if (newErrors.itemId || newErrors.quantity) {
      return
    }

    const selectedItem = inventory.find((item) => item.id === newPurchase.itemId)

    if (!selectedItem) {
      return
    }

    // Add purchase
    addPurchase({
      date: newPurchase.date,
      itemId: newPurchase.itemId,
      itemName: selectedItem.name,
      category: selectedItem.category,
      quantity: newPurchase.quantity,
    })

    // Reset form
    setNewPurchase({
      date: new Date().toISOString().split("T")[0],
      itemId: "",
      quantity: 1,
    })
    setIsAddDialogOpen(false)
  }
}