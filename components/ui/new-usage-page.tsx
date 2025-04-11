"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useInventory } from "@/context/inventory-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export function NewUsagePage() {
  const { inventory, addUsage } = useInventory()
  const router = useRouter()
  const [usage, setUsage] = useState({
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
  const selectedItem = inventory.find((item) => item.id === usage.itemId)

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const newErrors = {
      itemId: !usage.itemId,
      quantity: usage.quantity <= 0,
      insufficientStock: selectedItem ? usage.quantity > selectedItem.currentStock : false,
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
      date: usage.date,
      itemId: usage.itemId,
      itemName: selectedItem.name,
      category: selectedItem.category,
      quantity: usage.quantity,
    })

    // Redirect to usage page
    router.push("/usage")
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/usage">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Log Usage</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Usage Details</CardTitle>
            <CardDescription>Record usage of inventory items</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={usage.date}
                  onChange={(e) => setUsage({ ...usage, date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="item">Item</Label>
                <Select value={usage.itemId} onValueChange={(value) => setUsage({ ...usage, itemId: value })}>
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
                {errors.itemId && <p className="text-sm text-red-500">Please select an item</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity Used</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max={selectedItem?.currentStock || 1}
                  value={usage.quantity}
                  onChange={(e) => setUsage({ ...usage, quantity: Number.parseInt(e.target.value) || 0 })}
                  className={errors.quantity || errors.insufficientStock ? "border-red-500" : ""}
                />
                {errors.quantity && <p className="text-sm text-red-500">Quantity must be greater than 0</p>}
                {errors.insufficientStock && (
                  <p className="text-sm text-red-500">
                    Insufficient stock. Only {selectedItem?.currentStock} available.
                  </p>
                )}
              </div>

              {selectedItem && (
                <div className="p-3 bg-muted rounded-md text-sm">
                  <p>
                    Current stock of {selectedItem.name}: <strong>{selectedItem.currentStock}</strong>
                  </p>
                  {usage.quantity > 0 && (
                    <p>
                      After this usage: <strong>{Math.max(0, selectedItem.currentStock - usage.quantity)}</strong>
                    </p>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" type="button" asChild>
                  <Link href="/usage">Cancel</Link>
                </Button>
                <Button type="submit">Log Usage</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
