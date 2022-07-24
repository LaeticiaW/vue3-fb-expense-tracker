import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'
import { screen, fireEvent, within } from '@testing-library/vue'
import Imports from '@/components/imports/Imports.vue'
import SpecUtil from '@/../test/unit/specUtil'

import dayjs from 'dayjs'
import ImportService from '@/services/import'

describe('Imports.vue', () => {
  const imports = [
    {
      id: '1',
      importDate: '2020-04-17',
      fileName: 'Visa1-01_01_2020_to_04_05_2020.CSV',
      description: 'mycreditcard1',
      recordCount: 30,
    },
    {
      id: '2',
      importDate: '2020-04-17',
      fileName: 'Visa2-Jan1-Apr7.csv',
      description: 'mycreditcard2',
      recordCount: 164,
    },
  ]

  beforeEach(() => {
    vi.spyOn(ImportService, 'getImports').mockImplementation(SpecUtil.getPromiseData(imports))
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  test('Renders page title', async () => {
    await SpecUtil.render(Imports)

    screen.getByText('Import Expenses')
  })

  test('Filter contains startDate and endDate inputs and import expenses button', async () => {
    await SpecUtil.render(Imports)

    const filter = screen.getByTestId('table-filter')

    // Get the filter values
    const startDate: HTMLInputElement = within(filter).getByLabelText('Start Date')
    const endDate: HTMLInputElement = within(filter).getByLabelText('End Date')
    const importExpensesButton = within(filter).getByRole('button')

    // Get year to date start and end date values
    const start = dayjs().startOf('year').format('YYYY-MM-DD')
    const end = dayjs().format('YYYY-MM-DD')

    // Verify filter values
    expect(startDate.value).toEqual(start)
    expect(endDate.value).toEqual(end)
    expect(importExpensesButton).toBeDefined()
  })

  test('Table contains correct header values', async () => {
    await SpecUtil.render(Imports)

    const table = screen.getByTestId('data-table')
    const columnHeaders = within(table).getAllByRole('columnheader')

    expect(columnHeaders.length).toEqual(5)

    within(columnHeaders[0]).getByText('Date')
    within(columnHeaders[1]).getByText('File Name')
    within(columnHeaders[2]).getByText('Description')
    within(columnHeaders[3]).getByText('Records')
    within(columnHeaders[4]).getByText('Actions')
  })

  test('Table contains import rows with correct values', async () => {
    await SpecUtil.render(Imports)

    const table = screen.getByTestId('data-table')

    const firstRow = (await within(table).findByRole('cell', { name: imports[1].description }))
      .parentElement
    const secondRow = (await within(table).findByRole('cell', { name: imports[0].description }))
      .parentElement

    const firstRowCells = within(firstRow!).getAllByRole('cell')
    const secondRowCells = within(secondRow!).getAllByRole('cell')

    within(firstRowCells[0]).getByText(imports[1].importDate)
    within(firstRowCells[1]).getByText(imports[1].fileName)
    within(firstRowCells[2]).getByText(imports[1].description)
    within(firstRowCells[3]).getByText(imports[1].recordCount)

    within(secondRowCells[0]).getByText(imports[0].importDate)
    within(secondRowCells[1]).getByText(imports[0].fileName)
    within(secondRowCells[2]).getByText(imports[0].description)
    within(secondRowCells[3]).getByText(imports[0].recordCount)
  })

  test('Table footer displays the number of rows', async () => {
    await SpecUtil.render(Imports)

    const tableFooter = screen.getByTestId('table-footer')

    within(tableFooter).getByText(`${imports.length} rows`)
  })

  test('Clicking the Import Expenses button displays the Import Expenses Dialog', async () => {
    await SpecUtil.render(Imports)

    const importExpensesButton = screen.getByTitle('Import Expenses')

    // Verify the dialog is not yet displayed
    let dialog = screen.queryByTestId('importDialog')
    expect(dialog).toBeNull()

    // Trigger a button click
    await fireEvent.click(importExpensesButton)

    // Verify the dialog is now displayed
    dialog = screen.queryByTestId('importDialog')
    expect(dialog).not.toBeNull()
    within(dialog!).getByText('Import Expenses')
  })
})
