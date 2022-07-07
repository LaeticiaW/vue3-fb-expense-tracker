import { ComputedRef } from 'vue'
import ExpenseService from '@/services/expense'
import { Expense, ExpenseFilter } from '@/types/expense'
import { QueryResponse } from '@/types/query'
import { useQuery } from '@/hooks/data/useQuery'

/*
 * Retrieves the expenses
 */
export default function (filter: ExpenseFilter): ComputedRef<QueryResponse<Expense[]>> {
  console.log('In useExpenses')
  const queryResponse = useQuery<Expense[], ExpenseFilter>({
    promise: ExpenseService.getExpenses,
    filter: filter,
    initialState: [],
  })

  return queryResponse
}
