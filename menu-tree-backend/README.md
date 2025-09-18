# Menu Tree System - Backend

A robust NestJS backend API for managing hierarchical menu systems with full CRUD operations, built with Prisma ORM and PostgreSQL.

## 🚀 Features

- **Hierarchical Menu Structure**: Support for unlimited nested menu levels
- **Complete CRUD Operations**: Create, Read, Update, Delete menus and submenus
- **Tree Operations**: Move menus between parents, reorder menus
- **Data Validation**: Comprehensive input validation with class-validator
- **API Documentation**: Auto-generated Swagger documentation
- **Error Handling**: Proper error responses and validation
- **Circular Reference Protection**: Prevents invalid parent-child relationships
- **Database Relations**: Optimized queries with Prisma ORM

## 🛠️ Tech Stack

- **Framework**: NestJS
- **Database**: MySQL
- **ORM**: Prisma
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI
- **TypeScript**: Full type safety

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## ⚡ Quick Start

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd menu-tree-backend
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
DATABASE_URL="mysql://username:password@localhost:5432/menutree_db"
NODE_ENV="development"
PORT=value
```

Replace `username`, `password`, and `menutree_db` with your PostgreSQL credentials.

### 3. Database Setup

```bash
# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed the database with sample data
npm run prisma:seed
```

### 4. Start Development Server

```bash
npm run start:dev
```

The API will be available at:
- **API**: http://localhost:3001
- **Swagger Docs**: http://localhost:3001/api

## 📚 API Endpoints

### Menu Operations

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/menus` | Get all menus (flat list) |
| `GET` | `/menus/tree` | Get hierarchical menu tree |
| `GET` | `/menus/:id` | Get specific menu by ID |
| `POST` | `/menus` | Create new menu/submenu |
| `PATCH` | `/menus/:id` | Update existing menu |
| `DELETE` | `/menus/:id` | Delete menu (must not have children) |
| `PATCH` | `/menus/:id/move` | Move menu to different parent |
| `POST` | `/menus/reorder` | Reorder menus within same parent |

### Example API Calls

#### Create Root Menu
```bash
curl -X POST http://localhost:3001/menus \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Products",
    "description": "Product management",
    "icon": "package",
    "url": "/products",
    "order": 1
  }'
```

#### Create Submenu
```bash
curl -X POST http://localhost:3001/menus \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Add Product",
    "description": "Create new product",
    "icon": "plus",
    "url": "/products/add",
    "order": 1,
    "parentId": "parent-menu-id"
  }'
```

#### Get Menu Tree
```bash
curl http://localhost:3001/menus/tree
```

## 🗃️ Database Schema

```prisma
model Menu {
  id          String   @id @default(cuid())
  name        String
  description String?
  icon        String?
  url         String?
  order       Int      @default(0)
  isActive    Boolean  @default(true)
  
  // Self-referential relationship
  parentId    String?
  parent      Menu?    @relation("MenuHierarchy", fields: [parentId], references: [id])
  children    Menu[]   @relation("MenuHierarchy")
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## 🔧 Available Scripts

```bash
# Development
npm run start:dev          # Start with hot reload
npm run start:debug        # Start in debug mode

# Build & Production
npm run build              # Build for production
npm run start:prod         # Start production server

# Database
npm run prisma:generate    # Generate Prisma client
npm run prisma:migrate     # Run migrations
npm run prisma:push        # Push schema to database
npm run prisma:seed        # Seed database
npm run prisma:studio      # Open Prisma Studio

# Testing & Quality
npm run test               # Run unit tests
npm run test:e2e          # Run end-to-end tests
npm run lint              # Run ESLint
npm run format            # Format code with Prettier
```

## 🏗️ Project Structure

```
src/
├── main.ts                 # Application entry point
├── app.module.ts           # Root application module
├── prisma/
│   ├── prisma.module.ts    # Prisma module
│   └── prisma.service.ts   # Prisma service
└── menu/
    ├── menu.module.ts      # Menu module
    ├── menu.controller.ts  # REST API endpoints
    ├── menu.service.ts     # Business logic
    └── dto/                # Data Transfer Objects
        ├── create-menu.dto.ts
        ├── update-menu.dto.ts
        └── menu-response.dto.ts

prisma/
├── schema.prisma           # Database schema
└── seed.ts                # Database seeding
```

## 🔍 Key Features Explained

### Hierarchical Structure
- Self-referential database design using `parentId`
- Unlimited nesting levels supported
- Efficient tree traversal with Prisma includes

### Validation & Error Handling
- Input validation using class-validator decorators
- Circular reference detection and prevention
- Proper HTTP status codes and error messages
- Conflict detection (duplicate names at same level)

### Business Logic
- Automatic order management
- Parent validation before operations
- Cascading delete protection (must delete children first)
- Move operations with circular reference checks

### API Design
- RESTful endpoints following best practices
- Comprehensive Swagger documentation
- Consistent response formats
- CORS enabled for frontend integration

## 🚦 Error Handling

The API returns appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors, circular references)
- `404` - Not Found (menu or parent not found)
- `409` - Conflict (duplicate menu names)
- `500` - Internal Server Error

## 🔐 Security Considerations

- Input validation on all endpoints
- SQL injection protection via Prisma
- CORS configuration for frontend domains
- Environment variable protection for database credentials

## 📊 Sample Data

The seed script creates a sample menu structure:
- Dashboard
- User Management
  - All Users
  - Add User  
  - Roles & Permissions
- Settings
  - General Settings
  - Security
  - Integrations
- Reports
  - User Analytics
  - System Performance
  - Financial Reports

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   ```bash
   # Check PostgreSQL is running
   pg_ctl status
   
   # Verify DATABASE_URL in .env
   # Ensure database exists
   ```

2. **Prisma Client Not Generated**
   ```bash
   npm run prisma:generate
   ```

3. **Migration Issues**
   ```bash
   # Reset database (⚠️ destroys data)
   npm run prisma:migrate reset
   ```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Next Steps

To complete the full-stack application:

1. **Frontend Development**: Build NextJS frontend with tree view
2. **Authentication**: Add JWT-based authentication
3. **Authorization**: Implement role-based menu access
4. **Caching**: Add Redis for menu caching
5. **Testing**: Comprehensive unit and integration tests
6. **Deployment**: Docker containerization and deployment scripts

Ready to build the frontend? Let me know and I'll create the NextJS application with a beautiful tree interface! 🎯