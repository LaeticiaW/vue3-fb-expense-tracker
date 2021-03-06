import { ref, watch, computed, ComputedRef, UnwrapRef } from 'vue'
import { QueryResponse, QueryOptions } from '@/types/query'

export function useQuery<Data, Filter = void>(
  options: QueryOptions<Data, Filter>
): ComputedRef<QueryResponse<Data>> {
  const queryResponse = ref<QueryResponse<Data>>({
    data: options.initialState,
    isLoading: true,
    error: undefined,
    internalError: undefined,
    fetch: fetch,
  })

  // Initialize optional parameters
  if (options.runQuery === undefined) options.runQuery = true
  if (options.watchFilter === undefined && options.filter !== undefined) options.watchFilter = true

  // Retrieve the data
  async function getData() {
    queryResponse.value.isLoading = true
    queryResponse.value.error = undefined
    queryResponse.value.internalError = undefined
    try {
      queryResponse.value.error = undefined
      let data: Data
      if (options.filter) {
        data = await options.promise(options.filter)
      } else {
        data = await (options.promise as () => Promise<Data>)()
      }
      queryResponse.value.data = data as UnwrapRef<Data>
    } catch (err) {
      console.error('Error retrieving query data:', err)
      queryResponse.value.error = 'An error occurred retrieving data'
      queryResponse.value.internalError = err
      throw err
    } finally {
      queryResponse.value.isLoading = false
    }
  }

  async function fetch() {
    await getData()
  }

  if (options.runQuery) {
    fetch()
  }

  // Retrieve the data whenever the filter changes
  if (options.watchFilter) {
    watch(
      () => options.filter,
      () => {
        fetch()
      },
      { deep: true }
    )
  }

  // Return a computed property with the query response
  const result: ComputedRef<QueryResponse<Data>> = computed(() => {
    return {
      data: queryResponse.value.data as Data,
      isLoading: queryResponse.value.isLoading,
      error: queryResponse.value.error,
      internalError: queryResponse.value.internalError,
      fetch: fetch,
    } as QueryResponse<Data>
  })

  return result
}
