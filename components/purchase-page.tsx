"use client"

import { useState } from "react"
import { useInventory, type PurchaseLog } from "@/context/inventory-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
