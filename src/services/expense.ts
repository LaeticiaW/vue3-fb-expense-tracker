import { unref } from 'vue'
import { db, query, doc, collection, Query } from '@/firebase/firebase'
import { getDocs, setDoc, where, deleteDoc, writeBatch, limit } from '@/firebase/firebase'
import { Expense, ExpenseFilter } from '@/types/expense'
import { ImportDetails } from '@/types/import'
import CategoryService from '@/services/category'
import dayjs from 'dayjs'
import { v4 as uuidv4 } from 'uuid'
import { cloneDeep } from 'lodash-es'

export default {
  /*
   * Retrieve the expense list
   * @param {object} filter - filter values to use when retrieving the expenses
   */

  async getExpenses(filter: ExpenseFilter): Promise<Expense[]> {
    try {
      const expenses: Expense[] = []
      const categories = await CategoryService.getCategories()
      const categoryMap = CategoryService.getCategoryMap(categories)
      const subcategoryMap = CategoryService.getSubcategoryMap(categories)

      const filterCategoryIds = unref(filter.categoryIds)
      const filterStartDate = unref(filter.startDate)
      const filterEndDate = unref(filter.endDate)

      let expenseQuery: Query
      if (filterCategoryIds && Array.isArray(filterCategoryIds) && filterCategoryIds.length) {
        expenseQuery = query(
          collection(db, 'expenses'),
          where('trxDate', '>=', filterStartDate),
          where('trxDate', '<=', filterEndDate),
          where('categoryId', 'in', filterCategoryIds)
        )
      } else {
        expenseQuery = query(
          collection(db, 'expenses'),
          where('trxDate', '>=', filterStartDate),
          where('trxDate', '<=', filterEndDate)
        )
      }

      const querySnapshot = await getDocs(expenseQuery)
      querySnapshot.forEach((doc) => {
        const expense = doc.data()
        expenses.push(expense as Expense)
        if (expense.categoryId) {
          expense.categoryName = categoryMap[expense.categoryId]?.name || ''
          if (expense.categoryName && expense.subcategoryId) {
            expense.subcategoryName = subcategoryMap[expense.subcategoryId]?.name || ''
          }
        }
      })

      return expenses
    } catch (error) {
      console.error('ExpenseService.getExpenses error:', error)
      throw error
    }
  },

  /*
   * Save an expense, either via create or update
   * @param {object} expense - expense object to save
   */
  saveExpense(expense: Expense) {
    if (expense.id === undefined) {
      return this.createExpense(expense)
    }
    return this.updateExpense(expense)
  },

  /*
   * Create a new expense
   * @param {object} expense - expense object to save
   */
  async createExpense(expense: Expense) {
    try {
      expense.id = uuidv4()
      expense.trxYear = dayjs(expense.trxDate).year()
      expense.trxMonth = dayjs(expense.trxDate).month() + 1
      if (typeof expense.id === 'string') {
        await setDoc(doc(db, 'expenses', expense.id), expense)
      }
    } catch (error) {
      console.error('ExpenseService.createExpense error', error)
      throw error
    }
  },

  /*
   * Update an existing expense
   * @param {object} expense - expense object to update
   */
  async updateExpense(expense: Expense) {
    try {
      expense.trxYear = dayjs(expense.trxDate).year()
      expense.trxMonth = dayjs(expense.trxDate).month() + 1
      if (typeof expense.id === 'string') {
        await setDoc(doc(db, 'expenses', expense.id), expense)
      }
    } catch (error) {
      console.error('ExpenseService.updateExpense error', error)
      throw error
    }
  },

  /*
   * Delete an expense
   * @param {string} expenseId - id of expense to delete
   */
  async deleteExpense(expenseId: string) {
    try {
      await deleteDoc(doc(db, 'expenses', expenseId))
    } catch (error) {
      console.error('ExpenseService.deleteExpense error', error)
      throw error
    }
  },

  /*
   * Import expenses uploaded from a csv file
   * @param {array} expenses - array of expense objects
   * @param {object} importDetails - details of the import
   */
  async importExpenses(expenses: Expense[], importDetails: ImportDetails) {
    const importExpenses = cloneDeep(expenses)

    // Normalize the trxDate to 'YYYY-MM-DD' and remove $ from amount
    importExpenses.forEach((exp) => {
      exp.trxDate = dayjs(exp.trxDate, importDetails.dateFormat).format('YYYY-MM-DD')
      exp.trxYear = dayjs(exp.trxDate).year()
      exp.trxMonth = dayjs(exp.trxDate).month() + 1

      if (typeof exp.amount === 'string' && exp.amount.substr(0, 1) === '$') {
        exp.amount = exp.amount.substr(1)
      }
    })

    try {
      // Get a new write batch
      const batch = writeBatch(db)

      // Insert the import summary document
      importDetails.id = uuidv4()
      batch.set(doc(db, 'imports', importDetails.id), importDetails)

      // Insert each expense document
      importExpenses.forEach((exp: Expense) => {
        exp.id = uuidv4()
        exp.importId = importDetails.id
        if (typeof exp.id === 'string') {
          batch.set(doc(db, 'expenses', exp.id), exp)
        }
      })

      // Commit the batch
      await batch.commit()
    } catch (error) {
      console.error('Error importing expenses:', error)
      throw error
    }
  },

  /*
   * Delete expenses by import id
   * @param {string} importId - import id
   */
  async deleteExpensesByImportId(importId: string) {
    // Retrieve all expenses with the specified importId
    const expenses: Expense[] = []
    const expenseQuery = query(collection(db, 'expenses'), where('importId', '==', importId))

    const querySnapshot = await getDocs(expenseQuery)

    querySnapshot.forEach((doc) => {
      const expense = doc.data()
      expenses.push(expense as Expense)
    })

    // Get a new write batch
    const batch = writeBatch(db)

    // Delete the import summary record
    batch.delete(doc(db, 'imports', importId))

    // Delete each expense
    expenses.forEach((exp) => {
      if (typeof exp.id === 'string') {
        batch.delete(doc(db, 'expenses', exp.id))
      }
    })

    // Commit the batch
    await batch.commit()
  },

  /*
   * Determine if expenses are associated to a specified category
   */
  async isCategoryInUse(categoryId: string): Promise<boolean> {
    const expenseQuery = query(
      collection(db, 'expenses'),
      limit(1),
      where('categoryId', '==', categoryId)
    )

    const querySnapshot = await getDocs(expenseQuery)

    return querySnapshot.size ? true : false
  },

  /*
   * Determine if expenses are associated to a specified subcategory
   */
  async isSubcategoryInUse(subcategoryId: string): Promise<boolean> {
    const expenseQuery = query(
      collection(db, 'expenses'),
      limit(1),
      where('subcategoryId', '==', subcategoryId)
    )

    const querySnapshot = await getDocs(expenseQuery)

    return querySnapshot.size ? true : false
  },
}
