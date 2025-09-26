export interface Menu {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  url?: string;
  order: number;
  isActive: boolean;
  parentId?: string;
  children?: Menu[];
  createdAt: string;
  updatedAt: string;
  depth?: number;
}

export interface CreateMenuRequest {
  name: string;
  description?: string;
  icon?: string;
  url?: string;
  order?: number;
  isActive?: boolean;
  parentId?: string;
}

export type UpdateMenuRequest = Partial<CreateMenuRequest>;


export interface MoveMenuRequest {
  parentId?: string;
}

export interface ReorderMenusRequest {
  parentId?: string;
  orders: { id: string; order: number }[];
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error: string;
}

