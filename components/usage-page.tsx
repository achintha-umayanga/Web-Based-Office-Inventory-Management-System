"use client"

import { useState } from "react"
import { useInventory, type UsageLog } from "@/context/inventory-context"
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

export function UsagePage() {
  const { inventory, usages, addUsage } = useInventory()
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<keyof UsageLog>("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newUsage, setNewUsage] = useState({
    date: new Date().toISOString().split("T")[0],
    itemId: "",
    quantity: 1,
  })
  const [errors, setErrors] = useState({
    itemId: false,
    quantity: false,
    insufficientStock: false,
  })

  // Get selected item
  const selectedItem = inventory.find((item) => item.id === newUsage.itemId)

  // Filter usages based on search term
  const filteredUsages = usages.filter(
    (usage) =>
      usage.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usage.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Sort usages
  const sortedUsages = [...filteredUsages].sort((a, b) => {
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
  const handleSort = (field: keyof UsageLog) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection(field === "date" ? "desc" : "asc")
    }
  }

  // Handle add usage
  const handleAddUsage = () => {
    // Validate form
    const newErrors = {
      itemId: !newUsage.itemId,
      quantity: newUsage.quantity <= 0,
      insufficientStock: selectedItem ? newUsage.quantity > selectedItem.currentStock : false,
    }

    setErrors(newErrors)

    if (newErrors.itemId || newErrors.quantity || newErrors.insufficientStock) {
      return
    }

    if (!selectedItem) {
      return
    }

    // Add usage
    addUsage({
      date: newUsage.date,
      itemId: newUsage.itemId,
      itemName: selectedItem.name,
      category: selectedItem.category,
      quantity: newUsage.quantity,
    })

    // Reset form and close dialog
    setNewUsage({
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
          <h1 className="text-3xl font-bold">Usage Log</h1>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Log Usage
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log New Usage</DialogTitle>
                <DialogDescription>Record usage of inventory items.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={newUsage.date}
                    onChange={(e) => setNewUsage({ ...newUsage, date: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="item" className="text-right">
                    Item
                  </Label>
                  <div className="col-span-3">
                    <Select
                      value={newUsage.itemId}
                      onValueChange={(value) => setNewUsage({ ...newUsage, itemId: value })}
                    >
                      <SelectTrigger id="item" className={errors.itemId ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select an item" />
                      </SelectTrigger>
                      <SelectContent>
                        {inventory.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name} ({item.category}) - {item.currentStock} in stock
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.itemId && <p className="text-sm text-red-500 mt-1">Please select an item</p>}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="quantity" className="text-right">
                    Quantity Used
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      max={selectedItem?.currentStock || 1}
                      value={newUsage.quantity}
                      onChange={(e) => setNewUsage({ ...newUsage, quantity: Number.parseInt(e.target.value) || 0 })}
                      className={errors.quantity || errors.insufficientStock ? "border-red-500" : ""}
                    />
                    {errors.quantity && <p className="text-sm text-red-500 mt-1">Quantity must be greater than 0</p>}
                    {errors.insufficientStock && (
                      <p className="text-sm text-red-500 mt-1">
                        Insufficient stock. Only {selectedItem?.currentStock} available.
                      </p>
                    )}
                  </div>
                </div>
                {selectedItem && (
                  <div className="col-span-4 p-3 bg-muted rounded-md text-sm">
                    <p>
                      Current stock of {selectedItem.name}: <strong>{selectedItem.currentStock}</strong>
                    </p>
                    {newUsage.quantity > 0 && (
                      <p>
                        After this usage: <strong>{Math.max(0, selectedItem.currentStock - newUsage.quantity)}</strong>
                      </p>
                    )}
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddUsage}>Log Usage</Button>
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
          <Select value={sortField} onValueChange={(value) => handleSort(value as keyof UsageLog)}>
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
                <TableHead className="text-right">Quantity Used</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedUsages.length > 0 ? (
                sortedUsages.map((usage) => (
                  <TableRow key={usage.id}>
                    <TableCell>{new Date(usage.date).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">{usage.itemName}</TableCell>
                    <TableCell>{usage.category}</TableCell>
                    <TableCell className="text-right">{usage.quantity}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No usage records found.
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
