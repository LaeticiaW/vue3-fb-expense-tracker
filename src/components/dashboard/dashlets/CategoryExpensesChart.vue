<template>
  <dashlet :options="options">
    <!-- Dashlet Actions -->
    <template #actions>
      <!-- Start and end dates -->
      <date-range-input v-model:start-date="filter.startDate" v-model:end-date="filter.endDate" />
    </template>

    <!-- Dashlet Content -->
    <template #content>
      <div v-if="chartOptions" class="content-container">
        <div class="chart-container">
          <highcharts :options="chartOptions" />
        </div>
        <div class="chart-bottom-text">Total Expenses: ${{ totalExpensesAmount?.toFixed(2) }}</div>
      </div>
    </template>
  </dashlet>
</template>

<script setup lang="ts">
  import { ref, reactive, computed, ComputedRef } from 'vue'
  import Dashlet from '@/components/dashboard/Dashlet.vue'
  import DateRangeInput from '@/components/common/DateRangeInput.vue'
  import { GridItemData } from '@/types/vue3-grid-layout.d'
  import { PieChartSeries, DrillDownSeries } from '@/types/chart'
  import { usePieChart } from '@/hooks/chart/usePieChart'
  import useExpenseTotals from '@/hooks/data/useExpenseTotals'
  import { QueryResponse } from '@/types/query'
  import { ExpenseTotal } from '@/types/expense'
  import { useNotify } from '@/hooks/useNotify'
  import Util from '@/services/util'
  import dayjs from 'dayjs'

  defineProps<{
    options: GridItemData
  }>()

  const filter = {
    startDate: ref(dayjs().startOf('year').format('YYYY-MM-DD')),
    endDate: ref(dayjs().format('YYYY-MM-DD')),
    // startDate: ref(dayjs().startOf('year').toDate()),
    // endDate: ref(new Date()),
    categoryIds: ref([]),
  }

  const { showNotify } = useNotify()

  // Retrieve the expense totals data
  let expenseTotalsQuery: ComputedRef<QueryResponse<ExpenseTotal[]>>
  try {
    expenseTotalsQuery = useExpenseTotals(filter)
  } catch (error) {
    console.error('Error retrieving expense totals:', error)
    showNotify({ message: 'Error retrieving data for Category Expenses dashlet' })
  }

  // Calculate the total expenses amount
  const totalExpensesAmount = computed(() => {
    return expenseTotalsQuery.value?.data?.reduce((sum: number, cat) => {
      return Number(sum) + Number(cat.totalAmount)
    }, 0)
  })

  // Format the expense data for the pie chart series
  const series = computed((): PieChartSeries[] => {
    return (
      expenseTotalsQuery.value?.data?.map((item) => ({
        name: item.categoryName || 'Unknown',
        y: item.totalAmount,
        drilldown: item.categoryName || 'Unknown',
      })) || []
    )
  })

  // Format the expense data for the drilldown to subcategory level
  const drillDownSeries = computed((): DrillDownSeries[] => {
    return (
      expenseTotalsQuery.value?.data?.map((item) => ({
        name: item.categoryName,
        id: item.categoryName,
        data: item.subcategoryTotals.map((subcat) => {
          return [subcat.subcategoryName || 'Unknown', subcat.totalAmount]
        }),
      })) || []
    )
  })

  // Get the highchart options for the pie chart
  const chartOptions = usePieChart({
    seriesName: 'Categories',
    seriesData: series,
    drillDownSeries: drillDownSeries,
  })
</script>

<style lang="scss" scoped>
  .content-container {
    position: relative;
    height: 100%;

    .chart-container {
      position: relative;
      height: 100%;

      :deep(div[data-highcharts-chart]) {
        position: relative;
        height: 100% !important;
        width: 100%;
      }
    }
  }

  .filter-input {
    width: 120px !important;
    margin-right: 12px;
  }

  .chart-bottom-text {
    position: absolute;
    bottom: -24px;
    right: 4px;
    z-index: 5;
    opacity: 1;
    background-color: #ffffff;
  }
</style>
