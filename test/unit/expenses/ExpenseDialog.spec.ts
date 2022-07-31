import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'
import { screen, fireEvent } from '@testing-library/vue'
import ExpenseDialog from '@/components/expenses/ExpenseDialog.vue'
import ExpenseService from '@/services/expense'
import CategoryService from '@/services/category'
import SpecUtil from '@/../test/unit/specUtil'

describe('ExpenseDialog.vue', () => {
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

  const expense = {
    id: 503,
    trxDate: '2022-05-01',
    trxYear: 2020,
    trxMonth: 2,
    categoryId: '2',
    categoryName: 'Groceries',
    subcategoryId: '106',
    subcategoryName: 'Harris Teeter',
    description: 'Harris Teeter',
    amount: 74.15,
  }

  beforeEach(() => {
    vi.spyOn(CategoryService, 'getCategories').mockImplementation(
      SpecUtil.getPromiseData(categories)
    )
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  test('Renders expense dialog in Create mode', async () => {
    await SpecUtil.render(ExpenseDialog, { props: { modelValue: true } })

    // Verify dialog contains title, cancel and save buttons, form fields
    await screen.findByText('Create Expense')
    await screen.findByRole('button', { name: 'Cancel' })
    await screen.findByRole('button', { name: 'Save' })

    // Verify form input fields
    const startDate: HTMLInputElement = screen.getByLabelText('Start Date')
    const description: HTMLInputElement = screen.getByLabelText('Description')
    const category: HTMLSelectElement = screen.getByLabelText('Category')
    const subcategory: HTMLSelectElement = screen.getByLabelText('Subcategory')
    const amount: HTMLInputElement = screen.getByLabelText('Amount')

    expect(startDate.value).toEqual('')
    expect(description.value).toEqual('')
    expect(category.value).toEqual('')
    expect(subcategory.value).toEqual('')
    expect(amount.value).toEqual('')
  })

  test('Renders expense dialog in Update mode with form populated', async () => {
    await SpecUtil.render(ExpenseDialog, { props: { modelValue: true, expense: expense } })

    // Verify dialog contains title, cancel and save buttons, form fields
    await screen.findByText('Update Expense')
    await screen.findByRole('button', { name: 'Cancel' })
    await screen.findByRole('button', { name: 'Save' })

    // Verify form input fields
    const startDate: HTMLInputElement = screen.getByLabelText('Start Date')
    const description: HTMLInputElement = screen.getByLabelText('Description')
    const amount: HTMLInputElement = screen.getByLabelText('Amount')

    const category = await screen.findByText('Groceries')
    const subcategory = await screen.findByText('Harris Teeter')

    expect(startDate.value).toEqual('2022-05-01')
    expect(description.value).toEqual('Harris Teeter')
    expect(category).toBeDefined()
    expect(subcategory).toBeDefined()
    expect(amount.value).toEqual('74.15')
  })

  test('Clicking the Cancel button closes the dialog', async () => {
    const { emitted } = await SpecUtil.render(ExpenseDialog, {
      props: { modelValue: true, expense: expense },
    })

    // Verify the dialog is displayed
    const dialogTitle = screen.queryByText('Update Expense')
    expect(dialogTitle).not.toBeNull()

    // Trigger a cancel button click
    const cancelButton = screen.getByRole('button', { name: 'Cancel' })
    await fireEvent.click(cancelButton)

    // Verify the close dialog event is emitted
    expect(emitted()['update:modelValue'].length).toEqual(1)
    expect(emitted()['update:modelValue'][0][0]).toEqual(false)
  })

  test('Save an updated expense', async () => {
    const saveSpy = vi.spyOn(ExpenseService, 'saveExpense').mockImplementation(() => expense)

    const { emitted } = await SpecUtil.render(ExpenseDialog, {
      props: { modelValue: true, expense: expense },
    })

    // Verify the dialog is displayed
    const dialogTitle = screen.queryByText('Update Expense')
    expect(dialogTitle).not.toBeNull()

    // Change the description value in the form
    const description: HTMLInputElement = screen.getByLabelText('Description')
    await fireEvent.update(description, 'Updated description')
    expect(description.value).toBe('Updated description')

    // Trigger a click on the Save button
    const saveButton = screen.getByText(/save/i)
    await fireEvent.click(saveButton)

    // Verify the saveExpenses service method was called
    expect(saveSpy).toHaveBeenCalled()

    // Verify expense-updated event was emitted with the updated expense param, and
    // the update:modelValue event was emitted to close the dialog
    expect(emitted()['expense-updated'].length).toEqual(1)
    expect(emitted()['expense-updated'][0][0].value).toEqual(
      expect.objectContaining(Object.assign({}, expense, { description: 'Updated description' }))
    )
    expect(emitted()['update:modelValue'].length).toEqual(1)
    expect(emitted()['update:modelValue'][0][0]).toEqual(false)
  })
})
