// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.menu.deleteMany();
  console.log('🗑️  Cleared existing menus');

  // Create root menus
  const dashboard = await prisma.menu.create({
    data: {
      name: 'Dashboard',
      description: 'Main dashboard page',
      icon: 'dashboard',
      url: '/dashboard',
      order: 1,
      isActive: true,
    },
  });

  const userManagement = await prisma.menu.create({
    data: {
      name: 'User Management',
      description: 'User and role management',
      icon: 'users',
      url: '/users',
      order: 2,
      isActive: true,
    },
  });

  const settings = await prisma.menu.create({
    data: {
      name: 'Settings',
      description: 'Application settings',
      icon: 'settings',
      url: '/settings',
      order: 3,
      isActive: true,
    },
  });

  const reports = await prisma.menu.create({
    data: {
      name: 'Reports',
      description: 'Analytics and reports',
      icon: 'chart',
      url: '/reports',
      order: 4,
      isActive: true,
    },
  });

  // Submenus for User Management
  await prisma.menu.create({
    data: {
      name: 'All Users',
      description: 'View all users',
      icon: 'user-list',
      url: '/users/all',
      order: 1,
      isActive: true,
      parentId: userManagement.id,
    },
  });

  await prisma.menu.create({
    data: {
      name: 'Add User',
      description: 'Create new user',
      icon: 'user-plus',
      url: '/users/add',
      order: 2,
      isActive: true,
      parentId: userManagement.id,
    },
  });

  await prisma.menu.create({
    data: {
      name: 'Roles & Permissions',
      description: 'Manage user roles',
      icon: 'shield',
      url: '/users/roles',
      order: 3,
      isActive: true,
      parentId: userManagement.id,
    },
  });

  // Submenus for Settings
  await prisma.menu.create({
    data: {
      name: 'General Settings',
      description: 'General application settings',
      icon: 'cog',
      url: '/settings/general',
      order: 1,
      isActive: true,
      parentId: settings.id,
    },
  });

  await prisma.menu.create({
    data: {
      name: 'Security',
      description: 'Security settings',
      icon: 'lock',
      url: '/settings/security',
      order: 2,
      isActive: true,
      parentId: settings.id,
    },
  });

  await prisma.menu.create({
    data: {
      name: 'Integrations',
      description: 'Third-party integrations',
      icon: 'plug',
      url: '/settings/integrations',
      order: 3,
      isActive: true,
      parentId: settings.id,
    },
  });

  // Submenus for Reports
  await prisma.menu.create({
    data: {
      name: 'User Analytics',
      description: 'User activity reports',
      icon: 'bar-chart',
      url: '/reports/users',
      order: 1,
      isActive: true,
      parentId: reports.id,
    },
  });

  await prisma.menu.create({
    data: {
      name: 'System Performance',
      description: 'System performance metrics',
      icon: 'activity',
      url: '/reports/performance',
      order: 2,
      isActive: true,
      parentId: reports.id,
    },
  });

  await prisma.menu.create({
    data: {
      name: 'Financial Reports',
      description: 'Financial analytics',
      icon: 'dollar-sign',
      url: '/reports/financial',
      order: 3,
      isActive: true,
      parentId: reports.id,
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('📊 Created menus:');
  console.log('- Dashboard');
  console.log('- User Management');
  console.log('  - All Users');
  console.log('  - Add User');
  console.log('  - Roles & Permissions');
  console.log('- Settings');
  console.log('  - General Settings');
  console.log('  - Security');
  console.log('  - Integrations');
  console.log('- Reports');
  console.log('  - User Analytics');
  console.log('  - System Performance');
  console.log('  - Financial Reports');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
