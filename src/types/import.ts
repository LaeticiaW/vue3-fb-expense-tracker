import { Ref } from 'vue'

export type Import = {
  id: string
  description: string
  fileName: string
  importDate: string
  recordCount: number
}

export type ImportFilter = {
  startDate: Ref<string>
  endDate: Ref<string>
}

export type ImportDetails = {
  id?: string
  importDate: string
  fileName: string
  description: string
  recordCount: number
  dateFormat?: string
}

export type ImportFileInfo = {
  csvFile: Ref<File>
  dateFormat: Ref<string>
  negativeExpenses: Ref<boolean>
  description: Ref<string>
}
export type ImportFileStructure = {
  hasHeaderRow: Ref<boolean>
  dateFormatField: Ref<number>
  amountField: Ref<number>
  descriptionField: Ref<number>
}
