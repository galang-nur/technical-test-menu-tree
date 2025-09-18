// src/menu/menu.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { MenuResponseDto } from './dto/menu-response.dto';
import { MenuTreeResponseDto } from './dto/menu-tree-response.dto';

@ApiTags('menus')
@Controller('menus')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new menu' })
  @ApiResponse({ 
    status: 201, 
    description: 'Menu created successfully',
    type: MenuResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Parent menu not found' })
  @ApiResponse({ status: 409, description: 'Menu with same name already exists at this level' })
  create(@Body() createMenuDto: CreateMenuDto): Promise<MenuResponseDto> {
    return this.menuService.create(createMenuDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all menus (flat list)' })
  @ApiResponse({ 
    status: 200, 
    description: 'All menus retrieved successfully',
    type: [MenuResponseDto] 
  })
  findAll(): Promise<MenuResponseDto[]> {
    return this.menuService.findAll();
  }

  @Get('tree')
  @ApiOperation({ summary: 'Get menu tree structure' })
  @ApiResponse({ 
    status: 200, 
    description: 'Menu tree retrieved successfully',
    type: [MenuTreeResponseDto] 
  })
  findTree(): Promise<MenuTreeResponseDto[]> {
    return this.menuService.findTree();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a menu by ID' })
  @ApiParam({ name: 'id', description: 'Menu ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Menu retrieved successfully',
    type: MenuResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Menu not found' })
  findOne(@Param('id') id: string): Promise<MenuResponseDto> {
    return this.menuService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a menu' })
  @ApiParam({ name: 'id', description: 'Menu ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Menu updated successfully',
    type: MenuResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Menu not found' })
  @ApiResponse({ status: 409, description: 'Menu with same name already exists at this level' })
  update(
    @Param('id') id: string,
    @Body() updateMenuDto: UpdateMenuDto,
  ): Promise<MenuResponseDto> {
    return this.menuService.update(id, updateMenuDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a menu' })
  @ApiParam({ name: 'id', description: 'Menu ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Menu deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Cannot delete menu with children' })
  @ApiResponse({ status: 404, description: 'Menu not found' })
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.menuService.remove(id);
  }

  @Patch(':id/move')
  @ApiOperation({ summary: 'Move a menu to a different parent' })
  @ApiParam({ name: 'id', description: 'Menu ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Menu moved successfully',
    type: MenuResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Bad request - circular reference' })
  @ApiResponse({ status: 404, description: 'Menu or parent not found' })
  moveMenu(
    @Param('id') id: string,
    @Body() body: { parentId?: string },
  ): Promise<MenuResponseDto> {
    return this.menuService.moveMenu(id, body.parentId);
  }

  @Post('reorder')
  @ApiOperation({ summary: 'Reorder menus within the same parent' })
  @ApiResponse({ 
    status: 200, 
    description: 'Menus reordered successfully',
    type: [MenuResponseDto] 
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  reorderMenus(
    @Body() body: { parentId?: string; orders: { id: string; order: number }[] },
  ): Promise<MenuResponseDto[]> {
    return this.menuService.reorderMenus(body.parentId || null, body.orders);
  }
}