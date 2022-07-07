export type Subcategory = {
  id: string
  name: string
  matchText?: string[]
  parentId?: string
}

export type Category = {
  id: string
  name: string
  subcategories: Subcategory[]
}

export type SelectCategory = {
  label: string
  value: string
}
