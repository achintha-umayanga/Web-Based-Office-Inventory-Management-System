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
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newPurchase, setNewPurchase] = useState({
    date: new Date().toISOString().split("T")[0],
    itemId: "",
    quantity: 1,
  })
  const [errors, setErrors] = useState({
    itemId: false,
    quantity: false,
  })

  // Filter purchases based on search term
  const filteredPurchases = purchases.filter(
    (purchase) =>
      purchase.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Sort purchases
  const sortedPurchases = [...filteredPurchases].sort((a, b) => {
    if (sortField === "date") {
      return sortDirection === "asc"
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime()
    }

    if (a[sortField] < b[sortField]) return sortDirection === "asc" ? -1 : 1
    if (a[sortField] > b[sortField]) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  // Handle sort
  const handleSort = (field: keyof PurchaseLog) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection(field === "date" ? "desc" : "asc")
    }
  }

  // Handle add purchase
  const handleAddPurchase = () => {
    // Validate form
    const newErrors = {
      itemId: !newPurchase.itemId,
      quantity: newPurchase.quantity <= 0,
    }

    setErrors(newErrors)

    if (newErrors.itemId || newErrors.quantity) {
      return
    }

    // Get selected item details
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

    // Reset form and close dialog
    setNewPurchase({
      date: new Date().toISOString().split("T")[0],
      itemId: "",
      quantity: 1,
    })
    setIsAddDialogOpen(false)
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">Purchase Log</h1>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Purchase
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Purchase</DialogTitle>
                <DialogDescription>Record a new purchase to add to inventory.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={newPurchase.date}
                    onChange={(e) => setNewPurchase({ ...newPurchase, date: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="item" className="text-right">
                    Item
                  </Label>
                  <div className="col-span-3">
                    <Select
                      value={newPurchase.itemId}
                      onValueChange={(value) => setNewPurchase({ ...newPurchase, itemId: value })}
                    >
                      <SelectTrigger id="item" className={errors.itemId ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select an item" />
                      </SelectTrigger>
                      <SelectContent>
                        {inventory.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name} ({item.category})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.itemId && <p className="text-sm text-red-500 mt-1">Please select an item</p>}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="quantity" className="text-right">
                    Quantity
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={newPurchase.quantity}
                      onChange={(e) =>
                        setNewPurchase({ ...newPurchase, quantity: Number.parseInt(e.target.value) || 0 })
                      }
                      className={errors.quantity ? "border-red-500" : ""}
                    />
                    {errors.quantity && <p className="text-sm text-red-500 mt-1">Quantity must be greater than 0</p>}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddPurchase}>Add Purchase</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by item name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={sortField} onValueChange={(value) => handleSort(value as keyof PurchaseLog)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="itemName">Item Name</SelectItem>
              <SelectItem value="category">Category</SelectItem>
              <SelectItem value="quantity">Quantity</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}>
            {sortDirection === "asc" ? "↑" : "↓"}
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Item Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedPurchases.length > 0 ? (
                sortedPurchases.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell>{new Date(purchase.date).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">{purchase.itemName}</TableCell>
                    <TableCell>{purchase.category}</TableCell>
                    <TableCell className="text-right">{purchase.quantity}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No purchase records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  )
}
