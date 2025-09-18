// src/menu/menu.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { MenuResponseDto } from './dto/menu-response.dto';
import { MenuTreeResponseDto } from './dto/menu-tree-response.dto';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async create(createMenuDto: CreateMenuDto): Promise<MenuResponseDto> {
    const { parentId, ...menuData } = createMenuDto;

    // Validate parent exists if parentId is provided
    if (parentId) {
      const parentMenu = await this.prisma.menu.findUnique({
        where: { id: parentId },
      });
      if (!parentMenu) {
        throw new NotFoundException(`Parent menu with ID ${parentId} not found`);
      }
    }

    // Check if menu with same name exists at the same level
    const existingMenu = await this.prisma.menu.findFirst({
      where: {
        name: menuData.name,
        parentId: parentId || null,
      },
    });

    if (existingMenu) {
      throw new ConflictException(
        `Menu with name "${menuData.name}" already exists at this level`
      );
    }

    const menu = await this.prisma.menu.create({
      data: {
        ...menuData,
        parentId,
      },
      include: {
        children: true,
        parent: true,
      },
    });

    return this.formatMenuResponse(menu);
  }

  async findAll(): Promise<MenuResponseDto[]> {
    const menus = await this.prisma.menu.findMany({
      include: {
        children: {
          orderBy: { order: 'asc' },
        },
        parent: true,
      },
      orderBy: { order: 'asc' },
    });

    return menus.map(menu => this.formatMenuResponse(menu));
  }

  async findTree(): Promise<MenuTreeResponseDto[]> {
    const rootMenus = await this.prisma.menu.findMany({
      where: { parentId: null },
      include: {
        children: {
          include: {
            children: {
              include: {
                children: {
                  include: {
                    children: true, // Support up to 5 levels deep
                  },
                },
              },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    });

    return rootMenus.map(menu => this.formatMenuTreeResponse(menu));
  }

  async findOne(id: string): Promise<MenuResponseDto> {
    const menu = await this.prisma.menu.findUnique({
      where: { id },
      include: {
        children: {
          orderBy: { order: 'asc' },
        },
        parent: true,
      },
    });

    if (!menu) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }

    return this.formatMenuResponse(menu);
  }

  async update(id: string, updateMenuDto: UpdateMenuDto): Promise<MenuResponseDto> {
    const existingMenu = await this.prisma.menu.findUnique({
      where: { id },
    });

    if (!existingMenu) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }

    const { parentId, ...menuData } = updateMenuDto;

    // Validate parent exists if parentId is provided
    if (parentId) {
      // Prevent circular reference
      if (parentId === id) {
        throw new BadRequestException('Menu cannot be its own parent');
      }

      // Check if the new parent is a descendant of current menu
      const isDescendant = await this.isDescendant(id, parentId);
      if (isDescendant) {
        throw new BadRequestException(
          'Cannot set parent to a descendant menu (circular reference)'
        );
      }

      const parentMenu = await this.prisma.menu.findUnique({
        where: { id: parentId },
      });
      if (!parentMenu) {
        throw new NotFoundException(`Parent menu with ID ${parentId} not found`);
      }
    }

    // Check if menu with same name exists at the same level (excluding current menu)
    if (menuData.name) {
      const existingMenuWithName = await this.prisma.menu.findFirst({
        where: {
          name: menuData.name,
          parentId: parentId !== undefined ? parentId : existingMenu.parentId,
          id: { not: id },
        },
      });

      if (existingMenuWithName) {
        throw new ConflictException(
          `Menu with name "${menuData.name}" already exists at this level`
        );
      }
    }

    const updatedMenu = await this.prisma.menu.update({
      where: { id },
      data: {
        ...menuData,
        ...(parentId !== undefined && { parentId }),
      },
      include: {
        children: {
          orderBy: { order: 'asc' },
        },
        parent: true,
      },
    });

    return this.formatMenuResponse(updatedMenu);
  }

  async remove(id: string): Promise<{ message: string }> {
    const menu = await this.prisma.menu.findUnique({
      where: { id },
      include: { children: true },
    });

    if (!menu) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }

    // Check if menu has children
    if (menu.children.length > 0) {
      throw new BadRequestException(
        'Cannot delete menu that has children. Delete children first or move them to another parent.'
      );
    }

    await this.prisma.menu.delete({
      where: { id },
    });

    return { message: `Menu "${menu.name}" deleted successfully` };
  }

  async moveMenu(id: string, newParentId?: string): Promise<MenuResponseDto> {
    return this.update(id, { parentId: newParentId });
  }

  async reorderMenus(parentId: string | null, menuOrders: { id: string; order: number }[]): Promise<MenuResponseDto[]> {
    // Validate all menus exist and belong to the same parent
    const menus = await this.prisma.menu.findMany({
      where: {
        id: { in: menuOrders.map(mo => mo.id) },
        parentId: parentId,
      },
    });

    if (menus.length !== menuOrders.length) {
      throw new BadRequestException('Some menus not found or do not belong to the specified parent');
    }

    // Update orders in transaction
    await this.prisma.$transaction(
      menuOrders.map(({ id, order }) =>
        this.prisma.menu.update({
          where: { id },
          data: { order },
        })
      )
    );

    // Return updated menus
    const updatedMenus = await this.prisma.menu.findMany({
      where: { parentId: parentId },
      include: {
        children: {
          orderBy: { order: 'asc' },
        },
        parent: true,
      },
      orderBy: { order: 'asc' },
    });

    return updatedMenus.map(menu => this.formatMenuResponse(menu));
  }

  private async isDescendant(menuId: string, potentialDescendantId: string): Promise<boolean> {
    const descendants = await this.getAllDescendants(menuId);
    return descendants.some(desc => desc.id === potentialDescendantId);
  }

  private async getAllDescendants(menuId: string): Promise<any[]> {
    const children = await this.prisma.menu.findMany({
      where: { parentId: menuId },
    });

    let allDescendants = [...children];
    
    for (const child of children) {
      const childDescendants = await this.getAllDescendants(child.id);
      allDescendants = [...allDescendants, ...childDescendants];
    }

    return allDescendants;
  }

  private formatMenuResponse(menu: any): MenuResponseDto {
    return {
      id: menu.id,
      name: menu.name,
      description: menu.description,
      icon: menu.icon,
      url: menu.url,
      order: menu.order,
      isActive: menu.isActive,
      parentId: menu.parentId,
      children: menu.children?.map(child => this.formatMenuResponse(child)),
      createdAt: menu.createdAt,
      updatedAt: menu.updatedAt,
    };
  }

  private formatMenuTreeResponse(menu: any): MenuTreeResponseDto {
    return {
      id: menu.id,
      name: menu.name,
      description: menu.description,
      icon: menu.icon,
      url: menu.url,
      order: menu.order,
      isActive: menu.isActive,
      parentId: menu.parentId,
      children: menu.children?.map(child => this.formatMenuTreeResponse(child)) || [],
      createdAt: menu.createdAt,
      updatedAt: menu.updatedAt,
    };
  }
}