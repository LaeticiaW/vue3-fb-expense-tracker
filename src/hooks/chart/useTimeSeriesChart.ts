import { ref, watchEffect } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import { TimeSeries } from '../../types/chart'
import { Series, TooltipFormatterContextObject, ChartOptions } from 'highcharts'
import dayjs from 'dayjs'
import numeral from 'numeral'

type PointSeries = Series & {
  color: string
  legendSymbol: any
}

type SeriesData = Ref<TimeSeries[]> | ComputedRef<TimeSeries[]>

type DataOptions = {
  seriesData: SeriesData
}

// Defines the Highcharts time series chart options, and recalculates when the props change
export function useTimeSeriesChart(options: DataOptions) {
  const chartOptions = ref<ChartOptions>()

  function getChartOptions(dataOptions: DataOptions): any {
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
          return formatTimeSeriesSharedTooltip(this as unknown as TooltipFormatterContextObject)
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
      series: (dataOptions as DataOptions).seriesData,
    }
  }

  // Recalculate the chart options when the props change
  watchEffect(() => {
    chartOptions.value = getChartOptions(options)
  })

  // Formats a time series shared tooltip
  function formatTimeSeriesSharedTooltip(ctx: TooltipFormatterContextObject): string {
    // Format the date
    const formattedDate = dayjs(ctx.points![0].key).format('MMMM YYYY')

    let tooltipMarkup = `<div class="graph-tooltip" style="opacity: 1">
    <div class="graph-tooltip-inner" style="opacity: 1; z-index: 101"><b>${formattedDate}</b>`
    let value: string
    let percent: string
    const { points } = ctx
    let symbolHtml: string

    if (!points) return ''

    // Sort the points by y value descending
    points.sort((pointA, pointB) => pointB.y! - pointA.y!)

    // Calculate the total of all point values
    const totalValue = points!.reduce((total, pt) => total + pt.y!, 0)

    // Create the tooltip markup for each point
    const flexStyle = 'display: flex; justify-content: space-between;'

    points.forEach((point) => {
      value = numeral(point.y).format('$0,0.00')
      percent = totalValue ? numeral(point.y! / totalValue).format('0.00%') : '0'

      const pointSeries = point.series as PointSeries

      if (pointSeries.legendSymbol) {
        symbolHtml = pointSeries.legendSymbol.element.outerHTML

        tooltipMarkup +=
          `<div class="tooltip-row symbolhtml" style="${flexStyle}">` +
          '  <div class="tooltip-label" style="padding-right: 30px;">' +
          `    <svg width="16" height="16" color="${pointSeries.color}">${symbolHtml}</svg>` +
          `    ${pointSeries.name}: ` +
          '  </div>' +
          `  <div class="tooltip-value"><b>${value} (${percent})</b></div>` +
          '</div>'
      }
    })

    tooltipMarkup +=
      `<div class="tooltip-row" style="${flexStyle} margin-top: 8px;">` +
      '  <div class="tooltip-label">Total:</div>' +
      `  <div class="tooltip-value">'${numeral(totalValue).format('$0,0.00')}</div>` +
      '</div>'

    return tooltipMarkup
  }

  return chartOptions
}
