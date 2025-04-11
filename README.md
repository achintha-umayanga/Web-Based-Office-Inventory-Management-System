# 🗂️ Office Inventory Management System

A web-based application built with **Next.js** and **Tailwind CSS** to help organizations manage and track office supplies and equipment. It provides an intuitive dashboard, inventory management, purchase logging, and usage tracking features—all with persistent local storage support.

---

## 📋 Table of Contents

1. [Introduction](#introduction)
2. [Setup Instructions](#setup-instructions)
3. [Architecture Details](#architecture-details)
4. [Feature Summary](#feature-summary)
5. [Usage Guide](#usage-guide)
6. [Technical Implementation](#technical-implementation)
7. [Extending the System](#extending-the-system)

---

## 📌 Introduction

The **Office Inventory Management System** allows users to:
- Monitor inventory levels
- Log item purchases
- Record usage
- Get alerts for low stock

Built with modern web technologies, it ensures fast performance and a responsive UI.

---

## ⚙️ Setup Instructions

### Prerequisites

- Node.js 18.x or later
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/achintha-umayanga/Web-Based-Office-Inventory-Management-System.git

# Install dependencies
npm install  # or yarn install

# Start the development server
npm run dev  # or yarn dev

# Visit the app in your browser
http://localhost:3000
```

### Production Build

```bash
npm run build
npm start
# or
yarn build
yarn start
```

---

## 🏗️ Architecture Details

### 🗂️ Project Structure

```
office-inventory-system/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── inventory/
│   ├── purchases/
│   └── usage/
├── components/
│   ├── dashboard-layout.tsx
│   ├── dashboard-page.tsx
│   ├── inventory-page.tsx
│   ├── purchases-page.tsx
│   ├── usage-page.tsx
│   └── theme-provider.tsx
├── context/
│   └── inventory-context.tsx
├── lib/
│   └── utils.ts
└── public/
```

### 🧰 Tech Stack

- **Frontend Framework**: Next.js 14+
- **UI Library**: shadcn/ui (Radix UI)
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Persistence**: Browser's localStorage

---

## 🚀 Feature Summary

### 📊 Dashboard

- Inventory stats (total items, stock levels)
- Low stock alerts
- Recent purchase/usage logs
- Quick navigation

### 📦 Inventory Management

- Add, edit, delete items
- Filter & sort by category
- Visual low-stock indicators

### 🛒 Purchase Logging

- Add new purchases
- Auto-update stock levels
- Filter & view purchase history

### 📉 Usage Tracking

- Record item usage
- Deduct from inventory
- Filter & view usage history

---

## 🧑‍💻 Usage Guide

### ➕ Add Inventory Item

1. Go to **Inventory**
2. Click **Add Item**
3. Fill: `Name`, `Category`, `Initial Stock`
4. Click **Add Item**

### ✏️ Edit Inventory Item

1. Find item → Click **⋮ > Edit**
2. Update details
3. Click **Save Changes**

### 🗑️ Delete Inventory Item

1. Click **⋮ > Delete**
2. Confirm deletion

### 🛒 Add Purchase

1. Go to **Purchases**
2. Click **Add Purchase**
3. Fill: `Date`, `Item`, `Quantity`
4. Click **Add Purchase**

### 📉 Log Usage

1. Go to **Usage**
2. Click **Log Usage**
3. Fill: `Date`, `Item`, `Quantity Used`
4. Confirm and **Log Usage**

---

## 🔍 Technical Implementation

### 📦 Data Models

```ts
interface InventoryItem {
  id: string
  name: string
  category: string
  initialStock: number
  currentStock: number
}

interface PurchaseLog {
  id: string
  date: string
  itemId: string
  itemName: string
  category: string
  quantity: number
}

interface UsageLog {
  id: string
  date: string
  itemId: string
  itemName: string
  category: string
  quantity: number
}
```

### 💾 Data Persistence

- Uses `localStorage` for:
  - `inventory`
  - `purchases`
  - `usage`
- Automatically loads/saves data via Context

### 🌐 State Management

- `InventoryProvider` handles state for all data
- Access state via `useInventory` hook

### 📱 Responsive Design

- Mobile-friendly navigation (sidebar)
- Tables & forms adapt to screen size
- Light/Dark theme support

---

## 🛠️ Extending the System

### ✅ Add New Features

1. Update models in `inventory-context.tsx`
2. Add new state/actions in the provider
3. Create components under `/components`
4. Define new routes in `/app`

### 🎨 Customization

- Modify Tailwind config in `tailwind.config.js`
- Replace or edit components in `/components`
- Change default data or logic in `inventory-context.tsx`

---

## 📬 Support

For bugs, improvements, or assistance, contact the system administrator or open an issue on the repository.

---

**Happy Managing!** 🎉
