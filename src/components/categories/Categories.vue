<template>
  <div class="page">
    <page-header title="Categories" />
    <page-error :error="categoriesQuery.error" />

    <!-- Grid layout with 1 row and 2 columns, left column for tree, right for details -->
    <div class="row" style="height: calc(100vh - 160px)" align="start" align-content="start">
      <div class="tree-container full-height col-xs-12 col-sm-6 col-md-5">
        <CategoryTree
          :categories="categories"
          @refresh="refreshCategories"
          @item-selected="onItemSelected"
          @category-updated="refreshCategories"
          @category-deleted="refreshCategories"
        />
      </div>
      <div class="details-container full-height col-xs-12 col-sm-6 col-md-7 q-pl-md">
        <CategoryDetails
          v-if="selectedItem && !isSubcategory(selectedItem)"
          :category="selectedItem"
          @category-updated="onCategoryUpdated"
          @category-deleted="onCategoryUpdated"
        />

        <subcategory-details
          v-if="selectedItem && isSubcategory(selectedItem)"
          :category="parentCategory!"
          :subcategory="selectedItem"
          @category-updated="onCategoryUpdated"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import PageHeader from '@/components/common/PageHeader.vue'
  import PageError from '@/components/common/PageError.vue'
  import CategoryDetails from '@/components/categories/CategoryDetails.vue'
  import SubcategoryDetails from '@/components/categories/SubcategoryDetails.vue'
  import { useLoading } from '@/hooks/useLoading'
  import { Category, Subcategory } from '@/types/category'
  import useCategories from '@/hooks/data/useCategories'
  import CategoryTree from '@/components/categories/CategoryTree.vue'
  import { isSubcategory } from '@/util/category'

  const selectedItem = ref<Category | Subcategory>()
  const parentCategory = ref<Category>()

  const { queryLoading } = useLoading()

  // Retrieve the categories data
  const categoriesQuery = useCategories()
  queryLoading([categoriesQuery])

  // Category data
  const categories = computed((): Category[] => {
    return categoriesQuery?.value?.data || []
  })

  // Refresh the categories data
  async function refreshCategories(cat: Category, subcat?: Subcategory) {
    categoriesQuery.value.fetch()
    if (subcat) {
      onItemSelected(subcat)
    } else {
      onItemSelected(cat)
    }
  }

  // Return the parent category for the specified subcategory
  function getParentCategory(subcategory: Subcategory) {
    const idx = categories.value.findIndex((cat) => cat.id === subcategory.parentId)
    if (idx !== -1) {
      return categories.value[idx]
    }
    return undefined
  }

  // Handle item selected in category tree
  function onItemSelected(item: Category | Subcategory) {
    selectedItem.value = item
    if (isSubcategory(item)) {
      parentCategory.value = getParentCategory(item)
    }
  }

  // Handle category updated
  function onCategoryUpdated(category: Category) {
    refreshCategories(category)
  }
</script>

<style lang="scss" scoped>
  @media (max-width: $breakpoint-xs-max) {
    .tree-container {
      max-height: 300px;
      margin-bottom: 8px;
    }
    .details-container {
      padding-left: 0px;
      padding-bottom: 8px;
    }
  }
</style>
