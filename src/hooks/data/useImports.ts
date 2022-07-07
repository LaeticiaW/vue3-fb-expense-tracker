import { ComputedRef } from 'vue'
import ImportService from '@/services/import'
import { Import, ImportFilter } from '@/types/import'
import { QueryResponse } from '@/types/query'
import { useQuery } from '@/hooks/data/useQuery'

/*
 * Retrieves the expenses
 */
export default function (filter: ImportFilter): ComputedRef<QueryResponse<Import[]>> {
  console.log('In useImports')
  const queryResponse = useQuery<Import[], ImportFilter>({
    promise: ImportService.getImports,
    filter: filter,
    initialState: [],
  })

  return queryResponse
}
