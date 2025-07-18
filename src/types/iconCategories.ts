
export interface IconCategory {
  id: string;
  name: string;
  description?: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryIcon {
  id: string;
  categoryId: string;
  iconName: string;
  displayName?: string;
  createdAt: string;
}

export interface IconWithCategory extends CategoryIcon {
  categoryName: string;
  categoryColor: string;
}
