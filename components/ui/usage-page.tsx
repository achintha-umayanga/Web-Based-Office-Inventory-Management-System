"use client"

import { useState } from "react"
import { useInventory, type UsageLog } from "@/context/inventory-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import Link from "next/link"

export function UsagePage() {
  const { usages } = useInventory()
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<keyof UsageLog>("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

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

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">Usage Log</h1>

          <Button asChild>
            <Link href="/usage/new">
              <Plus className="mr-2 h-4 w-4" />
              Log Usage
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
