import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'
import { screen, fireEvent, within } from '@testing-library/vue'
import SpecUtil from '@/../test/unit/specUtil'
import Expenses from '@/components/expenses/Expenses.vue'
import ExpenseService from '@/services/expense'
import CategoryService from '@/services/category'
import dayjs from 'dayjs'

describe('Expenses.vue', () => {
  const categories = [
    {
      id: '1',
      name: 'Auto',
      subcategories: [
        { id: '101', name: 'Auto Insurance', matchText: ['Progressive'] },
        { id: '102', name: 'Auto Service', matchText: ['Ford', 'Subaru'] },
        { id: '103', name: 'Gas', matchText: ['ExxonMobil', 'Valero'] },
      ],
    },
    {
      id: '2',
      name: 'Groceries',
      subcategories: [
        { id: '104', name: 'Costco', matchText: ['Costco'] },
        { id: '105', name: 'Food Lion', matchText: ['Food Lion'] },
        { id: '106', name: 'Harris Teeter', matchText: ['Harris Teeter', 'HarrisTeeter'] },
      ],
    },
    {
      id: '3',
      name: 'Utilities',
      subcategories: [
        { id: '107', name: 'Electric' },
        { id: '108', name: 'Gas', matchText: ['Valero'] },
        { id: '109', name: 'Internet', matchText: ['Spectrum'] },
      ],
    },
  ]

  const expenses = [
    {
      id: 503,
      trxDate: '2022-05-01',
      trxYear: 2020,
      trxMonth: 2,
      categoryId: '2',
      categoryName: 'Groceries',
      subcategoryId: '106',
      subcategoryName: 'Harris Teeter',
      description: 'Harris Teeter Desc',
      amount: 74.15,
    },
    {
      id: 502,
      trxDate: '2022-04-01',
      trxYear: 2020,
      trxMonth: 2,
      categoryId: '1',
      categoryName: 'Auto',
      subcategoryId: '101',
      subcategoryName: 'Auto Insurance',
      description: 'Some Insurance Co',
      amount: 257.28,
    },
    {
      id: 501,
      trxDate: '2022-03-01',
      trxYear: 2020,
      trxMonth: 2,
      categoryId: '1',
      categoryName: 'Auto',
      subcategoryId: '103',
      subcategoryName: 'Gas',
      description: 'Quick Gas',
      amount: 25.32,
    },
  ]

  beforeEach(() => {
    vi.spyOn(ExpenseService, 'getExpenses').mockImplementation(SpecUtil.getPromiseData(expenses))
    vi.spyOn(CategoryService, 'getCategories').mockImplementation(
      SpecUtil.getPromiseData(categories)
    )
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  test('Renders page title', async () => {
    await SpecUtil.render(Expenses)

    screen.getByText('Manage Expenses')
  })

  test('Renders table Filter', async () => {
    await SpecUtil.render(Expenses)

    const filter = screen.getByTestId('table-filter')

    // Get the filter values
    const startDate: HTMLInputElement = within(filter).getByLabelText('Start Date')
    const endDate: HTMLInputElement = within(filter).getByLabelText('End Date')
    const category: HTMLSelectElement = within(filter).getByLabelText('Category')
    const createExpenseButton = within(filter).getByRole('button')

    // Get year to date start and end date values
    const start = dayjs().startOf('year').format('YYYY-MM-DD')
    const end = dayjs().format('YYYY-MM-DD')

    // Verify filter values
    expect(startDate.value).toEqual(start)
    expect(endDate.value).toEqual(end)
    expect(category.value).toEqual('')
    expect(createExpenseButton).toBeDefined()
  })

  test('Table contains correct header values', async () => {
    await SpecUtil.render(Expenses)

    const table = screen.getByTestId('data-table')
    const columnHeaders = within(table).getAllByRole('columnheader')

    expect(columnHeaders.length).toEqual(6)

    within(columnHeaders[0]).getByText('Date')
    within(columnHeaders[1]).getByText('Description')
    within(columnHeaders[2]).getByText('Category')
    within(columnHeaders[3]).getByText('Subcategory')
    within(columnHeaders[4]).getByText('Amount')
    within(columnHeaders[5]).getByText('Actions')
  })

  test('Table footer contains number of rows', async () => {
    await SpecUtil.render(Expenses)

    const tableFooter = screen.getByTestId('table-footer')

    within(tableFooter).getByText(`${expenses.length} rows`)
  })

  test('Renders data table rows', async () => {
    await SpecUtil.render(Expenses)

    const table = screen.getByTestId('data-table')

    const firstRow = (await within(table).findByRole('cell', { name: '2022-03-01' })).parentElement
    const secondRow = (await within(table).findByRole('cell', { name: '2022-04-01' })).parentElement
    const thirdRow = (await within(table).findByRole('cell', { name: '2022-05-01' })).parentElement
    const firstRowCells = within(firstRow!).getAllByRole('cell')
    const secondRowCells = within(secondRow!).getAllByRole('cell')
    const thirdRowCells = within(thirdRow!).getAllByRole('cell')

    within(firstRowCells[0]).getByText(expenses[2].trxDate)
    within(firstRowCells[1]).getByText(expenses[2].description)
    within(firstRowCells[2]).getByText(expenses[2].categoryName)
    within(firstRowCells[3]).getByText(expenses[2].subcategoryName)
    within(firstRowCells[4]).getByText(expenses[2].amount)

    within(secondRowCells[0]).getByText(expenses[1].trxDate)
    within(secondRowCells[1]).getByText(expenses[1].description)
    within(secondRowCells[2]).getByText(expenses[1].categoryName)
    within(secondRowCells[3]).getByText(expenses[1].subcategoryName)
    within(secondRowCells[4]).getByText(expenses[1].amount)

    within(thirdRowCells[0]).getByText(expenses[0].trxDate)
    within(thirdRowCells[1]).getByText(expenses[0].description)
    within(thirdRowCells[2]).getByText(expenses[0].categoryName)
    within(thirdRowCells[3]).getByText(expenses[0].subcategoryName)
    within(thirdRowCells[4]).getByText(expenses[0].amount)
  })

  test('Clicking the Create Expense button displays the Create Expense Dialog', async () => {
    await SpecUtil.render(Expenses)

    const createExpenseButton = screen.getByTitle('Create Expense')

    // Verify the dialog is not yet displayed
    let dialogTitle = screen.queryByText('Create Expense')
    expect(dialogTitle).toBeNull()

    // Trigger a button click
    await fireEvent.click(createExpenseButton)

    // Verify the dialog is displayed
    dialogTitle = screen.queryByText('Create Expense')
    expect(dialogTitle).not.toBeNull()
  })

  test('Clicking the Delete Expense icon displays the Confirm Delete Expense dialog', async () => {
    await SpecUtil.render(Expenses)

    // Get the first expense table row delete button in the Actions column
    const deleteButtons = await screen.findAllByTitle('Delete Expense')
    const deleteButton = deleteButtons[0]

    // Verify the dialog is not yet displayed
    let dialogTitle = screen.queryByText('Create Expense')
    expect(dialogTitle).toBeNull()

    // Trigger a button click
    await fireEvent.click(deleteButton)

    // Verify the dialog is displayed
    dialogTitle = await screen.findByText('Confirm Delete Expense')
    expect(dialogTitle).not.toBeNull()
  })

  test('Clicking the Update Expense button displays the Update Expense dialog', async () => {
    await SpecUtil.render(Expenses)

    // Get the first expense table row delete button in the Actions column
    const updateButtons = await screen.findAllByTitle('Update Expense')
    const updateButton = updateButtons[0]

    // Verify the dialog is not yet displayed
    let dialogTitle = screen.queryByText('Update Expense')
    expect(dialogTitle).toBeNull()

    // Trigger a button click
    await fireEvent.click(updateButton)

    // Verify the dialog is displayed
    dialogTitle = await screen.findByText('Update Expense')
    expect(dialogTitle).not.toBeNull()
  })
})
