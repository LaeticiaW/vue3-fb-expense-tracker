import { ComputedRef, watch } from 'vue'
import { useQuasar } from 'quasar'
import { QueryResponse } from '@/types/query'

export function useLoading() {
  const $q = useQuasar()

  function startLoading() {
    $q.loadingBar.start(150)
  }

  function stopLoading() {
    $q.loadingBar.stop()
  }

  let loading = false
  function queryLoading(watchQueries: ComputedRef<QueryResponse<unknown>>[]) {
    watch(
      () => [...watchQueries.map((query) => query.value.isLoading)],
      (newValue: boolean[]) => {
        if (!loading) {
          loading = true
          startLoading()
        }
        if (newValue.filter((isLoading) => !isLoading).length === watchQueries.length) {
          stopLoading()
          loading = false
        }
      },
      { immediate: true }
    )
  }

  return {
    startLoading,
    stopLoading,
    queryLoading,
  }
}
