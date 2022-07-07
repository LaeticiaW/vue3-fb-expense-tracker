import { useQuasar, QNotifyOptions } from 'quasar'

export function useNotify(): { showNotify: (options: QNotifyOptions) => void } {
  const $q = useQuasar()

  const showNotify = (options: QNotifyOptions) => {
    $q.notify(options)
  }

  return {
    showNotify,
  }
}
