# Menu Tree System

A full-stack application for managing hierarchical menu systems with CRUD, drag & drop, and responsive UI.  
This project consists of two parts:

- **Frontend**: Next.js 15 (TypeScript, Tailwind CSS, React Query)
- **Backend**: NestJS (Prisma ORM, MySQL)

---

## 🚀 Features

- Hierarchical Menu Management (unlimited nesting)
- Drag & Drop Tree View (frontend)
- Dual Views: Tree & Grid
- CRUD API with validation (backend)
- Auto-generated Swagger Documentation
- Responsive Mobile-First Design
- Optimistic Updates & Toast Notifications
- Ready for Authentication & Role-based Access

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, React Query, React Hook Form, Zod, Radix UI, shadcn/ui  
- **Backend**: NestJS, Prisma ORM, MySQL (or PostgreSQL), Swagger/OpenAPI, class-validator

---

## 📂 Project Structure

menu-tree-system/

├── menu-tree-frontend/ # Next.js 15 App Router frontend
├── menu-tree-backend/ # NestJS + Prisma backend
└── README.md # This file


Each part has its own **README.md** for detailed setup and features.

---

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- MySQL or PostgreSQL running locally
- (Optional) Docker for containerized setup

---

## ⚡ Quick Start

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd menu-tree-system
```

### 2. Backend Setup
cd menu-tree-backend
npm install
cp .env.example .env
# configure DATABASE_URL
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run start:dev

### 3. Frontend setup
cd menu-tree-frontend
npm install
cp .env.example .env.local
npm run dev

📚 Documentation

For detailed instructions and features, please check readme.md inside of respective folders.
