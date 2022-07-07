import { db, query, doc, collection, getDocs, where, deleteDoc, Query } from '@/firebase/firebase'
import { Import, ImportFilter } from '@/types/import'

/*
  Firestore Import document properties
    id, importDate, fileName, description, recordCount
 */

export default {
  /*
   * Retrieve the list of import summaries
   * @param {object} filter - filter values to use when retrieving import summaries
   */
  async getImports(filter: ImportFilter) {
    try {
      const imports: Import[] = []

      const importQuery: Query = query(
        collection(db, 'imports'),
        where('importDate', '>=', filter.startDate.value),
        where('importDate', '<=', filter.endDate.value)
      )

      const querySnapshot = await getDocs(importQuery)

      querySnapshot.forEach((doc) => {
        const imp = doc.data()
        imports.push(imp as Import)
      })

      return imports
    } catch (error) {
      console.error('ImportService.getImports error:', error)
      throw error
    }
  },

  /*
   * Delete the specified import summary and all associated imported expenses
   * @param {string} importId - id of import to delete
   */
  async deleteImport(importId: string) {
    try {
      await deleteDoc(doc(db, 'imports', importId))
    } catch (error) {
      console.error('ExpenseService.deleteImport error', error)
      throw error
    }
  },
}
