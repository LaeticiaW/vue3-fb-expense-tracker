<template>
  <dashlet :dashlet-title="options.dashletTitle" :options="options">
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
      </div>
    </template>
  </dashlet>
</template>

<script setup lang="ts">
  import { ref, reactive, computed, ComputedRef } from 'vue'
  import { GridItemData } from '@/types/vue3-grid-layout.d'
  import Dashlet from '@/components/dashboard/Dashlet.vue'
  import Util from '@/services/util'
  import DateRangeInput from '@/components/common/DateRangeInput.vue'
  import dayjs from 'dayjs'
  import { TimeSeries } from '@/types/chart'
  import useExpenseTimeSeries from '@/hooks/data/useExpenseTimeSeries'
  import { useTimeSeriesChart } from '@/hooks/chart/useTimeSeriesChart'
  import { QueryResponse } from '@/types/query'
  import { useNotify } from '@/hooks/useNotify'

  defineProps<{
    options: GridItemData
  }>()

  const filter = {
    startDate: ref(dayjs().startOf('year').format('YYYY-MM-DD')),
    endDate: ref(dayjs().format('YYYY-MM-DD')),
    categoryIds: ref([]),
  }

  const { showNotify } = useNotify()

  // Retrieve the expense time series data
  let expenseTimeSeriesQuery: ComputedRef<QueryResponse<TimeSeries[]>>
  try {
    expenseTimeSeriesQuery = useExpenseTimeSeries(filter)
  } catch (error) {
    showNotify({ message: 'Error retrieving data for Expenses Over Time dashlet' })
  }

  // Get the highchart options for the time series chart
  const chartOptions = useTimeSeriesChart({
    seriesData: computed(() => expenseTimeSeriesQuery.value.data),
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
