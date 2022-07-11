<template>
  <dashlet :dashlet-title="options.dashletTitle" :options="options">
    <!-- Dashlet Actions -->
    <template #actions>
      <!-- Start and end dates -->
      <date-range-input v-model:start-date="filter.startDate" v-model:end-date="filter.endDate" />
    </template>
    <!-- Dashlet Content -->
    <template #content>
      <div v-if="chartOptions" class="content-container relative-position full-height">
        <div class="chart-container relative-position full-height">
          <highcharts :options="chartOptions" />
        </div>
      </div>
    </template>
  </dashlet>
</template>

<script setup lang="ts">
  import { ref, computed, ComputedRef } from 'vue'
  import Dashlet from '@/components/dashboard/Dashlet.vue'
  import DateRangeInput from '@/components/common/DateRangeInput.vue'
  import dayjs from 'dayjs'
  import { TimeSeries } from '@/types/chart'
  import useExpenseTimeSeries from '@/hooks/data/useExpenseTimeSeries'
  import { useTimeSeriesChart } from '@/hooks/chart/useTimeSeriesChart'
  import { QueryResponse } from '@/types/query'
  import { useNotify } from '@/hooks/useNotify'
  import { DashletOptions } from '@/types/dashboard'

  defineProps<{
    options: DashletOptions
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
  .filter-input {
    width: 120px !important;
    margin-right: 12px;
  }
</style>
