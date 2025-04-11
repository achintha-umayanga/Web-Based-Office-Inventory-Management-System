"use client"

import { useInventory } from "@/context/inventory-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Package, ShoppingCart, TrendingDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function DashboardPage() {
  const { inventory, purchases, usages } = useInventory()

  // Calculate summary statistics
  const totalItems = inventory.length
  const totalStock = inventory.reduce((sum, item) => sum + item.currentStock, 0)
  const lowStockItems = inventory.filter((item) => item.currentStock <= 5)
  const recentPurchases = [...purchases]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)

  const recentUsages = [...usages].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3)

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalItems}</div>
              <p className="text-xs text-muted-foreground">Different items in inventory</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStock}</div>
              <p className="text-xs text-muted-foreground">Total units across all items</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lowStockItems.length}</div>
              <p className="text-xs text-muted-foreground">Items with 5 or fewer units</p>
            </CardContent>
          </Card>
        </div>

        {lowStockItems.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Low Stock Alert</AlertTitle>
            <AlertDescription>
              {lowStockItems.map((item) => item.name).join(", ")} {lowStockItems.length === 1 ? "is" : "are"} running
              low.
              <div className="mt-2">
                <Button variant="outline" size="sm" onClick={() => (window.location.href = "/purchases")}>
                  Add Purchase
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Purchases</CardTitle>
              <CardDescription>Latest items added to inventory</CardDescription>
            </CardHeader>
            <CardContent>
              {recentPurchases.length > 0 ? (
                <ul className="space-y-2">
                  {recentPurchases.map((purchase, index) => (
                    <li key={index} className="flex justify-between border-b pb-2">
                      <span>{purchase.itemName}</span>
                      <span className="text-sm text-muted-foreground">
                        {purchase.quantity} units on {new Date(purchase.date).toLocaleDateString()}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No recent purchases</p>
              )}
              <div className="mt-4">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/purchases">View All Purchases</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Usage</CardTitle>
              <CardDescription>Latest items used from inventory</CardDescription>
            </CardHeader>
            <CardContent>
              {recentUsages.length > 0 ? (
                <ul className="space-y-2">
                  {recentUsages.map((usage, index) => (
                    <li key={index} className="flex justify-between border-b pb-2">
                      <span>{usage.itemName}</span>
                      <span className="text-sm text-muted-foreground">
                        {usage.quantity} units on {new Date(usage.date).toLocaleDateString()}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No recent usage</p>
              )}
              <div className="mt-4">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/usage">View All Usage</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
