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
  csvFile: Ref<File | undefined>
  dateFormat: Ref<string | undefined>
  negativeExpenses: Ref<boolean>
  description: Ref<string | undefined>
}
export type ImportFileStructure = {
  hasHeaderRow: Ref<boolean | undefined>
  dateFormatField: Ref<number | undefined>
  amountField: Ref<number | undefined>
  descriptionField: Ref<number | undefined>
}
