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
  const queryLoading = (watchQueries: ComputedRef<QueryResponse<unknown>>[]) => {
    watch(
      () => [...watchQueries.map((query) => query.value.isLoading)],
      (newValue: boolean[]) => {
        console.log('queryLoading newValue:', newValue)
        if (!loading) {
          loading = true
          startLoading()
        }
        if (newValue.filter((isLoading) => !isLoading).length === watchQueries.length) {
          console.log('queryLoading stopLoading')
          stopLoading()
        }
      },
      { immediate: true }
    )
  }

  // function queryLoading(watchQuery: ComputedRef<QueryResponse<unknown>>) {
  //   watch(
  //     () => watchQuery.value.isLoading,
  //     (newIsLoading: boolean) => {
  //       if (newIsLoading) {
  //         $q.loadingBar.start(100)
  //       } else {
  //         $q.loadingBar.stop()
  //       }
  //     },
  //     { immediate: true }
  //   )
  // }

  return {
    startLoading,
    stopLoading,
    queryLoading,
  }
}
