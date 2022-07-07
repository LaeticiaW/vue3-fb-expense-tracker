export type PieChartSeries = {
  name: string
  y: number
  drilldown?: string
}

export type TimeSeriesData = [string, number][]

export type TimeSeries = {
  name: string
  data: TimeSeriesData
}

export type DrillDownTuple = [string, number]

export type DrillDownSeries = {
  name: string
  id: string
  data: DrillDownTuple[]
}

export type ExpenseTotalsDrillDown = {
  name: string
  id: string
  data: DrillDownTuple[]
}
