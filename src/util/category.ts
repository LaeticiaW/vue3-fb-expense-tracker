import { Category, Subcategory } from '@/types/category'

export function isSubcategory(item: Category | Subcategory): item is Subcategory {
  return (item as Subcategory)?.parentId !== undefined
}
