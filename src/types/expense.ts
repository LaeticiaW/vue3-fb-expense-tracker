import { Ref } from 'vue'

export type Expense = {
  id?: string
  categoryId?: string
  subcategoryId?: string
  importId?: string
  trxDate: string
  trxYear?: number
  trxMonth?: number
  description?: string
  amount: number
  categoryName?: string
  subcategoryName?: string
}

export type NewExpense = Omit<Expense, 'id' | 'trxYear' | 'trxMonth'>

export type SubcategoryTotal = {
  subcategoryId: string
  subcategoryName: string
  totalAmount: number
}

export type ExpenseFilter = {
  startDate: Ref<string>
  endDate: Ref<string>
  categoryIds?: Ref<string[]>
}

export type ExpenseTotal = {
  categoryId: string
  categoryName: string
  totalAmount: number
  percentage: number
  subcategoryTotals: SubcategoryTotal[]
}

export type ExpenseSummary = {
  categoryId: string
  categoryName: string
  trxYear: number
  trxMonth: number
  totalAmount: number
}
