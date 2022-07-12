import { useQuasar, QNotifyOptions } from 'quasar'

export function useNotify(): { showNotify: (options: QNotifyOptions) => void } {
  const $q = useQuasar()

  function showNotify(options: QNotifyOptions) {
    $q.notify(options)
  }

  return {
    showNotify,
  }
}
