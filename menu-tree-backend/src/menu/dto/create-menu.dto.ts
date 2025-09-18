import { IsString, IsOptional, IsBoolean, IsInt, Min, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMenuDto {
  @ApiProperty({ description: 'Menu name', example: 'Dashboard' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ description: 'Menu description', required: false, example: 'Main dashboard page' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ description: 'Menu icon', required: false, example: 'dashboard-icon' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  icon?: string;

  @ApiProperty({ description: 'Menu URL', required: false, example: '/dashboard' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  url?: string;

  @ApiProperty({ description: 'Menu order', required: false, example: 1 })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;

  @ApiProperty({ description: 'Is menu active', required: false, example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ description: 'Parent menu ID', required: false, example: 'clh123abc' })
  @IsOptional()
  @IsString()
  parentId?: string;
}
