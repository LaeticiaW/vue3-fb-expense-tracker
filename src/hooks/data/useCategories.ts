import { ComputedRef } from 'vue'
import CategoryService from '@/services/category'
import { Category } from '@/types/category'
import { QueryResponse } from '@/types/query'
import { useQuery } from '@/hooks/data/useQuery'

/*
 * Retrieves the categories
 */
export default function (options?: { runQuery?: boolean }): ComputedRef<QueryResponse<Category[]>> {
  console.log('In useCategories')
  const queryResponse = useQuery<Category[]>({
    promise: CategoryService.getCategories,
    initialState: [],
    runQuery: options?.runQuery ?? true,
  })

  return queryResponse
}
