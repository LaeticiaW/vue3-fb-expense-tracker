import { db, query, doc, getDocs, setDoc, deleteDoc, collection, Query } from '@/firebase/firebase'
import { Category, Subcategory } from '@/types/category'
import { v4 as uuidv4 } from 'uuid'

export default {
  /*
   * Retrieve the list of all categories
   */
  async getCategories(): Promise<Category[]> {
    const categories: Category[] = []

    try {
      const categoryQuery = query(collection(db, 'categories'))
      const querySnapshot = await getDocs(categoryQuery)

      querySnapshot.forEach((doc) => {
        const category = doc.data() as Category
        category.subcategories.forEach((subcat) => {
          subcat.parentId = category.id
        })

        categories.push(category)
      })

      if (categories.length) {
        // Sort the categories by name
        categories.sort((a, b) => {
          return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        })
      }

      return categories
    } catch (error) {
      console.error('CategoryService.getCategories error:', error)
      throw error
    }
  },

  /*
   * Retrieve the categories data for a select drop down
   */
  async getCategorySelect() {
    try {
      const categories = await this.getCategories()
      const selectCategories = categories.map((item) => ({
        id: item.id,
        name: item.name,
      }))
      return selectCategories
    } catch (error) {
      console.error('CategoryService.getCategorySelect error', error)
      throw error
    }
  },

  /*
   * Create the categoryMap from a list of categories.  The categoryMap key is the categoryId
   * and the value is the category
   */
  getCategoryMap(categories: Category[]) {
    const categoryMap = categories.reduce((map, obj) => {
      map[obj.id] = obj
      return map
    }, {})
    return categoryMap
  },

  /*
   * Create the subcategoryMap from a list of categories.  The key is the subcategoryId and
   * the value is the subcategory
   */
  getSubcategoryMap(categories: Category[]) {
    const subcategoryMap = {}
    categories.forEach((category) => {
      category.subcategories.forEach((subcategory) => {
        subcategoryMap[subcategory.id] = subcategory
      })
    })
    return subcategoryMap
  },

  async saveCategory(category: Category) {
    if (!category.id) {
      return await this.createCategory(category)
    } else {
      return await this.updateCategory(category)
    }
  },

  /*
   * Create a new category
   * @param {object} categories - categories object to create
   */
  async createCategory(category: Category) {
    try {
      // Verify this category name is not a duplicate
      const isUnique = await this.isCategoryNameUnique(category)
      if (!isUnique) {
        throw 'Duplicate category'
      }

      category.id = uuidv4()
      await setDoc(doc(db, 'categories', category.id), category)
      return category
    } catch (error) {
      console.error('CategoryService.createCategory error', error)
      throw error
    }
  },

  /*
   * Update an existing category
   * @param {object} categories - categories object to update
   */
  async updateCategory(category: Category, addSubcategoryName?: string) {
    try {
      // If category name has changed, verify it is not a duplicate
      const isUnique = await this.isCategoryNameUnique(category)
      if (!isUnique) {
        throw 'Duplicate category'
      }

      // If a subcategory has been added, verify the subcategory name is unique within the category
      if (addSubcategoryName) {
        const names = category.subcategories.filter((sub) => {
          return sub.name.toLowerCase() === addSubcategoryName.toLowerCase()
        })
        if (names.length > 1) {
          throw 'Duplicate subcategory'
        }
      }

      await setDoc(doc(db, 'categories', category.id), category)
      return category
    } catch (error) {
      console.error('CategoryService.updateCategory error', error)
      throw error
    }
  },

  // Determine if a category name is unique
  async isCategoryNameUnique(category: Category) {
    try {
      const categories = await this.getCategories()
      const sameName = categories.find((cat) => {
        return cat.id !== category.id && cat.name.toLowerCase() === category.name.toLowerCase()
      })
      if (sameName) {
        return false
      }
      return true
    } catch (error) {
      console.error('CategoryService.isCategoryNameUnique error', error)
      throw error
    }
  },

  /*
   * Delete a categories
   * @param {string} categoryId - id of categories to delete
   */
  async deleteCategory(categoryId: string) {
    try {
      await deleteDoc(doc(db, 'categories', categoryId))
    } catch (error) {
      console.error('CategoryService.deleteCategory error', error)
      throw error
    }
  },
}
