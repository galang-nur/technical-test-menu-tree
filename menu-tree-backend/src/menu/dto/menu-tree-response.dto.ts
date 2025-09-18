export class MenuTreeResponseDto {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  url?: string;
  order: number;
  isActive: boolean;
  parentId?: string;
  children: MenuTreeResponseDto[];
  createdAt: Date;
  updatedAt: Date;
}