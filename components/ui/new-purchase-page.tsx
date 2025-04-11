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

export function NewPurchasePage() {
  const { inventory, addPurchase } = useInventory()
  const router = useRouter()
  const [purchase, setPurchase] = useState({
    date: new Date().toISOString().split("T")[0],
    itemId: "",
    quantity: 1,
  })
  const [errors, setErrors] = useState({
    itemId: false,
    quantity: false,
  })

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const newErrors = {
      itemId: !purchase.itemId,
      quantity: purchase.quantity <= 0,
    }

    setErrors(newErrors)

    if (newErrors.itemId || newErrors.quantity) {
      return
    }

    // Get selected item details
    const selectedItem = inventory.find((item) => item.id === purchase.itemId)

    if (!selectedItem) {
      return
    }

    // Add purchase
    addPurchase({
      date: purchase.date,
      itemId: purchase.itemId,
      itemName: selectedItem.name,
      category: selectedItem.category,
      quantity: purchase.quantity,
    })

    // Redirect to purchases page
    router.push("/purchases")
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/purchases">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Add Purchase</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Purchase Details</CardTitle>
            <CardDescription>Record a new purchase to add to inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={purchase.date}
                  onChange={(e) => setPurchase({ ...purchase, date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="item">Item</Label>
                <Select value={purchase.itemId} onValueChange={(value) => setPurchase({ ...purchase, itemId: value })}>
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
                {errors.itemId && <p className="text-sm text-red-500">Please select an item</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={purchase.quantity}
                  onChange={(e) => setPurchase({ ...purchase, quantity: Number.parseInt(e.target.value) || 0 })}
                  className={errors.quantity ? "border-red-500" : ""}
                />
                {errors.quantity && <p className="text-sm text-red-500">Quantity must be greater than 0</p>}
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" type="button" asChild>
                  <Link href="/purchases">Cancel</Link>
                </Button>
                <Button type="submit">Add Purchase</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
