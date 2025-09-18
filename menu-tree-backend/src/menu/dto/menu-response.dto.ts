export class MenuResponseDto {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  url?: string;
  order: number;
  isActive: boolean;
  parentId?: string;
  children?: MenuResponseDto[];
  createdAt: Date;
  updatedAt: Date;
}