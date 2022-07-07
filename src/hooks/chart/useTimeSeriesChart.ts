import { ref, watchEffect } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import { TimeSeries } from '../../types/chart'
import Util from '@/services/util'

/*
 * Defines the Highcharts pie chart options, and recalculates when the props change
 */
export function useTimeSeriesChart(options: {
  seriesData?: Ref<TimeSeries[]> | ComputedRef<TimeSeries[]>
}) {
  const chartOptions = ref()

  const getChartOptions = (dataOptions) => {
    return {
      chart: {
        type: 'line',
      },
      time: {
        useUTC: false,
      },
      title: {
        text: undefined,
      },
      tooltip: {
        shared: true,
        valueDecimals: 2,
        headerFormat: '',
        useHTML: true,
        outside: true,
        backgroundColor: 'rgb(239, 239, 239, 1)', // use rgb so can set opacity
        formatter() {
          return Util.formatTimeSeriesSharedTooltip(this)
        },
      },
      yAxis: {
        title: { text: 'Amount' },
      },
      xAxis: {
        type: 'datetime',
      },
      legend: {
        layout: 'horizontal',
        align: 'center',
        useHTML: true,
      },
      series: dataOptions.seriesData,
    }
  }

  // Recalculate the chart options when the props change
  watchEffect(() => {
    chartOptions.value = getChartOptions(options)
  })

  return chartOptions
}
