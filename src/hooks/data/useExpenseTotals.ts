import { computed, ComputedRef } from 'vue'
import { ExpenseTotal, ExpenseFilter } from '@/types/expense'
import { QueryResponse } from '@/types/query'
import useExpenses from '@/hooks/data/useExpenses'
import { cloneDeep } from 'lodash'

/*
 * Retrieves the expense totals by category
 */
export default function (filter: ExpenseFilter): ComputedRef<QueryResponse<ExpenseTotal[]>> {
  const expensesQuery = useExpenses(filter)

  const expenseTotals = computed(() => {
    const expenses = cloneDeep(expensesQuery.value.data)

    // Sort the expense data by category name and subcategory name
    expenses.sort((a, b) => {
      return (
        (a.categoryName || '').localeCompare(b.categoryName || '') ||
        (a.subcategoryName || '').localeCompare(b.subcategoryName || '')
      )
    })

    // Reformat the list, calculating the total for each category, and moving the
    // subcategory totals to an object
    let prevCatId = ''
    let prevSubcatId = ''
    let totalExpensesAmount = 0
    const expenseTotalsData: ExpenseTotal[] = []
    let categoryTotal

    expenses.forEach((record) => {
      const { categoryId, categoryName, subcategoryId, subcategoryName, amount } = record

      if (categoryId !== prevCatId) {
        if (prevCatId !== '') {
          expenseTotalsData.push(JSON.parse(JSON.stringify(categoryTotal)))
        }
        categoryTotal = {
          categoryId,
          categoryName,
          totalAmount: amount,
          subcategoryTotals: [
            {
              subcategoryId,
              subcategoryName,
              totalAmount: amount,
            },
          ],
        }
        prevCatId = categoryId!
        prevSubcatId = subcategoryId!
      } else {
        categoryTotal.totalAmount += amount

        if (subcategoryId !== prevSubcatId) {
          categoryTotal.subcategoryTotals.push({
            subcategoryId,
            subcategoryName,
            totalAmount: amount,
          })
          prevSubcatId = subcategoryId!
        } else {
          categoryTotal.subcategoryTotals[categoryTotal.subcategoryTotals.length - 1].totalAmount +=
            amount
        }
      }

      totalExpensesAmount += amount
    })

    if (categoryTotal) {
      expenseTotalsData.push(JSON.parse(JSON.stringify(categoryTotal)))
    }

    // Calculate the percent for each total Amount
    expenseTotalsData.forEach((exp) => {
      exp.percentage = (exp.totalAmount / totalExpensesAmount) * 100
    })

    return expenseTotalsData
  })

  return computed(() => {
    return {
      ...expensesQuery.value,
      data: expenseTotals.value,
    } as QueryResponse<ExpenseTotal[]>
  })
}
