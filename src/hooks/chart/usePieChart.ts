import { ref, watchEffect } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import numeral from 'numeral'
import { TooltipFormatterContextObject } from 'highcharts'
import { PieChartSeries, DrillDownSeries } from '../../types/chart'

/*
 * Defines the Highcharts pie chart options, and recalculates when the props change
 */
export function usePieChart(options: {
  seriesName: string
  seriesData?: Ref<PieChartSeries[]> | ComputedRef<PieChartSeries[]>
  drillDownSeries?: Ref<DrillDownSeries[]> | ComputedRef<DrillDownSeries>
}) {
  const chartOptions = ref()

  function getChartOptions(dataOptions) {
    return {
      chart: {
        type: 'pie',
      },
      title: {
        text: undefined,
      },
      tooltip: {
        headerFormat: '',
        useHTML: true,
        formatter(this: TooltipFormatterContextObject) {
          const amt = numeral(this.point.y).format('0,0.00')
          const pct = ` (${numeral(this.point.percentage).format('00.0')}%)`
          return `${this.point.name}: <b>$${amt}${pct}</b>`
        },
      },
      plotOptions: {
        series: {
          states: {
            inactive: {
              opacity: 1,
            },
          },
        },
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: false,
            distance: 25,
          },
          showInLegend: true,
          series: {
            states: {
              inactive: {
                opacity: 1,
              },
            },
          },
        },
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        useHTML: true,
      },
      series: {
        name: dataOptions.seriesName,
        data: dataOptions.seriesData?.value || [],
      },
      drilldown: {
        drillUpButton: {
          position: {
            y: 0,
            x: 32,
          },
        },
        series: dataOptions.drillDownSeries?.value || [],
      },
    }
  }

  // Recalculate the chart options when the props change
  watchEffect(() => {
    chartOptions.value = getChartOptions(options)
  })

  return chartOptions
}
