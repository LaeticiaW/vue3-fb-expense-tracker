import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'
import { screen, fireEvent, within } from '@testing-library/vue'
import ExpenseSummary from '@/components/expenses/ExpenseSummary.vue'
import ExpenseService from '@/services/expense'
import CategoryService from '@/services/category'
import SpecUtil from '@/../test/unit/specUtil'
import dayjs from 'dayjs'

describe('ExpenseSummary.vue', () => {
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
    await SpecUtil.render(ExpenseSummary)

    screen.getByText('Expense Summary')
  })

  test('Renders table Filter', async () => {
    await SpecUtil.render(ExpenseSummary)

    const filter = screen.getByTestId('table-filter')

    // Get the filter values
    const startDate: HTMLInputElement = within(filter).getByLabelText('Start Date')
    const endDate: HTMLInputElement = within(filter).getByLabelText('End Date')
    const category: HTMLSelectElement = within(filter).getByLabelText('Category')

    // Get year to date start and end date values
    const start = dayjs().startOf('year').format('YYYY-MM-DD')
    const end = dayjs().format('YYYY-MM-DD')

    // Verify filter values
    expect(startDate.value).toEqual(start)
    expect(endDate.value).toEqual(end)
    expect(category.value).toEqual('')
  })

  test('Table contains correct column header values', async () => {
    await SpecUtil.render(ExpenseSummary)

    const table = screen.getByTestId('data-table')
    const columnHeaders = within(table).getAllByRole('columnheader')

    within(columnHeaders[0]).getByText('')
    within(columnHeaders[1]).getByText('Category')
    within(columnHeaders[2]).getByText('Percent')
    within(columnHeaders[3]).getByText('Amount')
  })

  test('Table footer contains number of rows', async () => {
    await SpecUtil.render(ExpenseSummary)

    const tableFooter = screen.getByTestId('table-footer')

    within(tableFooter).getByText(`2 rows`)
  })

  test('Renders data table rows', async () => {
    await SpecUtil.render(ExpenseSummary)

    const table = screen.getByTestId('data-table')

    // Verify the summary rows
    const firstRow = (await within(table).findByRole('cell', { name: 'Auto' })).parentElement
    const secondRow = (await within(table).findByRole('cell', { name: 'Groceries' })).parentElement

    const firstRowCells = within(firstRow!).getAllByRole('cell')
    const secondRowCells = within(secondRow!).getAllByRole('cell')

    within(firstRowCells[1]).getByText('Auto')
    within(firstRowCells[2]).getByText('79.22')
    within(firstRowCells[3]).getByText(`${(expenses[1].amount + expenses[2].amount).toFixed(2)}`)

    within(secondRowCells[1]).getByText('Groceries')
    within(secondRowCells[2]).getByText('20.78')
    within(secondRowCells[3]).getByText(expenses[0].amount)

    // Expand a row and verify the expanded rows
    const expandIcon = within(firstRowCells[0]).getByRole('button')
    fireEvent.click(expandIcon)

    await screen.findByText('Auto Insurance')
    await screen.findByText('Gas')
  })

  test('Table rows can be expanded', async () => {
    await SpecUtil.render(ExpenseSummary)

    const table = screen.getByTestId('data-table')

    // Verify the summary rows
    const firstRow = (await within(table).findByRole('cell', { name: 'Auto' })).parentElement
    const firstRowCells = within(firstRow!).getAllByRole('cell')

    // Expand the Auto row to display the subcategory rows
    let subcat1 = await screen.findByText('Auto Insurance')
    let subcat2 = await screen.findByText('Gas')

    expect(subcat1).toBeNull
    expect(subcat2).toBeNull

    const expandIcon = within(firstRowCells[0]).getByRole('button')
    fireEvent.click(expandIcon)

    subcat1 = await screen.findByText('Auto Insurance')
    subcat2 = await screen.findByText('Gas')

    expect(subcat1).not.toBeNull
    expect(subcat2).not.toBeNull
  })
})
