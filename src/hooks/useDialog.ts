import { useQuasar, QDialogOptions, DialogChainObject } from 'quasar'

export function useDialog(): { showDialog: (options: QDialogOptions) => DialogChainObject } {
  const $q = useQuasar()

  const showDialog = (options: QDialogOptions): DialogChainObject => {
    return $q.dialog({
      title: 'Confirm',
      cancel: true,
      persistent: true,
      ...options,
    })
  }

  return {
    showDialog,
  }
}
