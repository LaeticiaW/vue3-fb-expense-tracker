import { QTableColumn } from 'quasar'

// Created from quasar qTable item slot description
export type GridItemProps<Data> = {
  key: string
  row: Data
  rowIndex: number
  pageIndex: number
  cols: (QTableColumn & { value: string | number | boolean })[]
  colsMap: Record<string, string | number | boolean>
  sort: (col: string | Record<string, string | number | boolean>) => void
  selected: boolean
  expand: boolean
  color: string
  dark: boolean
  dense: boolean
}
