/*
 * Spec Utility methods
 */

import { Quasar, Notify, LoadingBar, Dialog } from 'quasar'
import { render } from '@testing-library/vue'
import flushPromises from 'flush-promises'
import { merge } from 'lodash'

// To get rid of: Error: Not implemented: window.scrollTo
const noop = () => {
  return
}
Object.defineProperty(window, 'scrollTo', { value: noop, writable: true })

export default {
  async render(component, options) {
    const globalPlugins = {
      global: {
        plugins: [[Quasar, { plugins: { Notify, LoadingBar, Dialog } }]],
      },
    }

    const renderOptions = options ? merge(options, globalPlugins) : globalPlugins

    const result = render(component, renderOptions)

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
  getPromiseData(data) {
    return function () {
      return Promise.resolve(data)
    }
  },

  getPromiseData2(data) {
    return function () {
      return {
        then(callback) {
          callback(data)

          return {
            catch() {},
          }
        },
      }
    }
  },

  /*
   * Generic function to use with jest.spyOn when the method returns a rejected promise
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

  // Remove transition styles to prevent delay that breaks tests
  // vue-test-utils: https://github.com/vuejs/vue-test-utils/issues/839
  stubTransitions() {
    const { getComputedStyle } = window
    window.getComputedStyle = function getComputedStyleStub(el) {
      return {
        ...getComputedStyle(el),
        transitionDelay: '',
        transitionDuration: '',
        animationDelay: '',
        animationDuration: '',
      }
    }
  },
}
