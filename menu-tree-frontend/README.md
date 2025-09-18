# Menu Tree System - Frontend

A modern, responsive NextJS frontend for the Menu Tree System with drag & drop functionality, built with TypeScript, Tailwind CSS, and React Query.

## 🚀 Features

- **Interactive Tree View**: Hierarchical menu display with expand/collapse
- **Drag & Drop Support**: Reorder and move menus between parents
- **Dual View Modes**: Tree view and grid view for different perspectives
- **Real-time Updates**: Optimistic updates with React Query
- **Form Validation**: Comprehensive validation with Zod and React Hook Form
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Modern UI Components**: Built with Radix UI and shadcn/ui
- **Toast Notifications**: User-friendly feedback with Sonner
- **Loading States**: Smooth loading experiences
- **Error Handling**: Graceful error states and retry mechanisms

## 🛠️ Tech Stack

- **Framework**: NextJS 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: TanStack React Query
- **Form Handling**: React Hook Form + Zod validation
- **Drag & Drop**: hello-pangea/dnd
- **Notifications**: Sonner
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running on http://localhost:3001

## ⚡ Quick Start

### 1. Install Dependencies

```bash
cd menu-tree-frontend
npm install
```

### 2. Environment Setup

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at http://localhost:3000

## 📱 Features Overview

### Tree View
- **Hierarchical Display**: Visual tree structure with indentation
- **Expand/Collapse**: Click to expand/collapse menu branches
- **Drag & Drop**: Reorder menus and move between parents
- **Inline Actions**: Edit, delete, and add submenus directly
- **Visual Indicators**: Icons for folders/files, active/inactive status

### Grid View
- **Card Layout**: Clean card-based display of all menus
- **Quick Overview**: See all menu details at a glance
- **Click to Edit**: Direct access to edit functionality
- **Status Badges**: Visual indicators for menu status

### Form Management
- **Dynamic Forms**: Create and edit menus with validation
- **Parent Selection**: Choose parent menu from dropdown
- **Real-time Validation**: Instant feedback on form errors
- **Auto-save**: Form state preservation

### Statistics Dashboard
- **Menu Counts**: Total, active, inactive, and root-level menus
- **Visual Metrics**: Color-coded statistics cards
- **Real-time Updates**: Stats update with menu changes

## 🎨 UI Components

### Custom Components
- `MenuTree`: Main tree view with drag & drop
- `MenuForm`: Create/edit menu form with validation
- `MenuCard`: Grid view card component
- `MenuActions`: Action buttons for menu operations

### shadcn/ui Components
- Button, Input, Textarea
- Card, Dialog, Tabs
- Badge, Toast notifications
- Form components with validation

##