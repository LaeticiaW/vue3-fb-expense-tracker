/*
 * Spec Utility methods
 */
import { ComponentPublicInstance } from 'vue'
import { Quasar, Notify, LoadingBar, Dialog } from 'quasar'
import { render, RenderOptions } from '@testing-library/vue'
import flushPromises from 'flush-promises'
import { merge } from 'lodash'

// To get rid of: Error: Not implemented: window.scrollTo
const noop = () => {
  return
}
Object.defineProperty(window, 'scrollTo', { value: noop, writable: true })

export default {
  /*
   * Renders a vue component for vue testing library tests with quasar plugins
   */
  async render(component: ComponentPublicInstance, options: RenderOptions) {
    const globalPlugins = {
      global: {
        plugins: [[Quasar, { plugins: { Notify, LoadingBar, Dialog } }]],
      },
    }

    const renderOptions = options ? merge(options, globalPlugins) : globalPlugins

    const result = render(component, renderOptions as RenderOptions)

    await flushPromises()

    return result
  },

  /*
   * Returns a function that returns a promise that resolves to the data parameter, useful in
   * spyOn calls when you want a mockImplementation of an asynchronous method that just returns
   * test data.
   * Example:
   *     const expenses = [<expense object>, <expense object>...]
   *     const expenseSpy = vi.spyOn(ExpenseService, 'getExpenses')
   *                          .mockImplementation(SpecUtil.getPromiseData(expenses)
   */
  getPromiseData(data: any) {
    return function () {
      return Promise.resolve(data)
    }
  },

  /*
   * Generic function to use with vi.spyOn when the method returns a rejected promise
   */
  rejectPromise() {
    const response = {
      data: {
        messages: ['one'],
      },
    }

    return function () {
      return Promise.reject(response)
    }
  },
}
