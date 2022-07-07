import { computed, ComputedRef } from 'vue'
import { ExpenseFilter, Expense, ExpenseSummary } from '@/types/expense'
import { TimeSeries, TimeSeriesData } from '@/types/chart'
import { QueryResponse } from '@/types/query'
import useExpenses from '@/hooks/data/useExpenses'
import dayjs from 'dayjs'
import numeral from 'numeral'

/*
 * Retrieves the expense totals by category
 */
export default function (filter: ExpenseFilter): ComputedRef<QueryResponse<TimeSeries[]>> {
  console.log('in useExpenseTimeSeries')
  const expensesQuery = useExpenses(filter)

  const expenseTimeSeries = computed(() => {
    const expenses: Expense[] = expensesQuery.value.data

    // Sort the expense data by categoryid, trxYear, and trxMonth
    expenses.sort((a, b) => {
      return (
        (a.categoryId || '').localeCompare(b.categoryId || '') ||
        a.trxYear! - b.trxYear! ||
        a.trxMonth! - b.trxMonth!
      )
    })

    // Group by categoryId, trxYear, trxMonth and sum the amount
    const expenseSummaries: ExpenseSummary[] = []
    let prevCatId = ''
    let prevTrxYear: number
    let prevTrxMonth: number
    let expenseSummary: ExpenseSummary
    expenses.forEach((exp, idx) => {
      if (idx === 0) {
        expenseSummary = {
          categoryId: exp.categoryId,
          categoryName: exp.categoryName,
          trxYear: exp.trxYear!,
          trxMonth: exp.trxMonth!,
          totalAmount: exp.amount,
        }
      } else if (
        exp.categoryId === prevCatId &&
        exp.trxYear === prevTrxYear &&
        exp.trxMonth === prevTrxMonth
      ) {
        expenseSummary.totalAmount += exp.amount
      } else {
        expenseSummaries.push(expenseSummary)
        expenseSummary = {
          categoryId: exp.categoryId,
          categoryName: exp.categoryName,
          trxYear: exp.trxYear!,
          trxMonth: exp.trxMonth!,
          totalAmount: exp.amount,
        }
      }
      prevCatId = exp.categoryId
      prevTrxYear = exp.trxYear!
      prevTrxMonth = exp.trxMonth!
    })

    // Convert data to Highcharts time series format, one time series per category
    const series: TimeSeries[] = []
    let seriesObj: TimeSeries
    let prevCatName = ''
    let data: TimeSeriesData = []
    let dt
    prevCatId = ''
    expenseSummaries.forEach((exp) => {
      if (exp.categoryId !== prevCatId && prevCatId !== '') {
        seriesObj = {
          name: prevCatName,
          data: data,
        }
        series.push(seriesObj)
        data = []
      }
      dt = dayjs(
        `${exp.trxYear.toString()}-${numeral(exp.trxMonth).format('00')}-01`,
        'YYYY-MM-DD'
      ).valueOf()

      data.push([dt, Number(exp.totalAmount.toFixed(2))])

      prevCatId = exp.categoryId
      prevCatName = exp.categoryName || 'Unknown'
    })
    if (expenseSummaries.length) {
      seriesObj = {
        name: prevCatName,
        data: data,
      }
      series.push(seriesObj)
    }

    return series
  })

  return computed(() => {
    return {
      ...expensesQuery.value,
      data: expenseTimeSeries.value,
    } as QueryResponse<TimeSeries[]>
  })
}
