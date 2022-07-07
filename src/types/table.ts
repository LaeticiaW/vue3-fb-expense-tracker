import { QTableColumn } from 'quasar'

// Created from quasar qTable item slot description
export type GridItemProps<Data> = {
  key: any
  row: Data
  rowIndex: number
  pageIndex: number
  cols: (QTableColumn & { value: any })[]
  colsMap: Record<string, any>
  sort: (col: string | Record<string, any>) => void
  selected: boolean
  expand: boolean
  color: string
  dark: boolean
  dense: boolean
}
