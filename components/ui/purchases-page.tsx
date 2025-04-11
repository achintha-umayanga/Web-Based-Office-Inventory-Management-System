"use client"

import { useState } from "react"
import { useInventory, type PurchaseLog } from "@/context/inventory-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import Link from "next/link"

export function PurchasesPage() {
  const { purchases } = useInventory()
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<keyof PurchaseLog>("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

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

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">Purchase Log</h1>

          <Button asChild>
            <Link href="/purchases/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Purchase
            </Link>
          </Button>
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
