<template>
  <div class="full-height">
    <q-card flat bordered class="category-tree-panel full-height">
      <!-- Toolbar -->
      <q-toolbar dense flat class="bg-secondary">
        <q-space />
        <q-btn dark round size="xs" icon="mdi-dots-vertical" color="primary" title="Actions">
          <q-menu>
            <q-list dense>
              <q-item v-close-popup clickable @click="showAddCategoryDialog = true">
                <q-item-section>Add Category</q-item-section>
              </q-item>
              <q-item
                v-close-popup
                clickable
                :disable="!isCategorySelected"
                @click="showAddSubcategoryDialog = true"
              >
                <q-item-section>Add Subcategory</q-item-section>
              </q-item>
              <q-item
                v-close-popup
                clickable
                :disable="!isCategorySelected && !isSubcategorySelected"
                @click="deleteItem"
              >
                <q-item-section>Delete</q-item-section>
              </q-item>
              <q-separator />
              <q-item v-close-popup clickable @click="expandAllCategories">
                <q-item-section>Expand All Categories</q-item-section>
              </q-item>
              <q-item v-close-popup clickable @click="collapseAllCategories">
                <q-item-section>Collapse All Categories</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>

      <q-card-section style="height: calc(100% - 50px); overflow: auto">
        <!-- Category Tree -->
        <q-tree
          ref="qTreeRef"
          v-model:expanded="expandedKeys"
          :nodes="categories"
          node-key="id"
          label-key="name"
          children-key="subcategories"
          selected-color="primary"
          no-selection-unset
        >
          <template #default-header="prop">
            <div
              class="row items-center justify-between cursor-pointer"
              :class="{ selected: isSelected(prop.node) }"
              style="width: 100%"
              @click="onSelected(prop.node)"
            >
              <div>{{ prop.node.name }}</div>
              <div v-if="isSelected(prop.node)">
                <q-btn
                  v-if="!isSubcategory(prop.node)"
                  flat
                  round
                  icon="mdi-plus"
                  color="primary"
                  title="Add subcategory"
                  size="12px"
                  class="tree-btn"
                  @click="showAddSubcategoryDialog = true"
                />
                <q-btn
                  flat
                  round
                  icon="mdi-delete"
                  color="primary"
                  :title="isSubcategory(prop.node) ? 'Delete Subcategory' : 'Delete Category'"
                  size="12px"
                  class="tree-btn q-ml-sm"
                  @click="deleteItem(prop.node)"
                />
              </div>
            </div>
          </template>
        </q-tree>
      </q-card-section>
    </q-card>

    <!-- Add Category dialog -->
    <CategoryDialog
      v-if="showAddCategoryDialog"
      v-model="showAddCategoryDialog"
      @category-updated="onCategoryUpdated"
      @category-added="onCategoryAdded"
    />

    <!-- Add Subcategory dialog -->
    <SubcategoryDialog
      v-if="showAddSubcategoryDialog && currentCategory"
      v-model="showAddSubcategoryDialog"
      :category="currentCategory"
      @category-updated="onCategoryUpdated"
      @subcategory-updated="onSubcategoryUpdated"
      @subcategory-added="onSubcategoryAdded"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import { Category, Subcategory } from '@/types/category'
  import CategoryService from '@/services/category'
  import ExpenseService from '@/services/expense'
  import { QTree } from 'quasar'
  import CategoryDialog from '@/components/categories/CategoryDialog.vue'
  import SubcategoryDialog from '@/components/categories/SubcategoryDialog.vue'
  import { useDialog } from '@/hooks/useDialog'
  import { useNotify } from '@/hooks/useNotify'
  import { isSubcategory } from '@/util/category'

  const props = defineProps<{
    categories: Category[]
  }>()

  const emit = defineEmits(['item-selected', 'tree-updated'])

  const qTreeRef = ref<QTree>()
  const selectedKey = ref<string>()
  const expandedKeys = ref<string[]>([])
  const showAddCategoryDialog = ref(false)
  const showAddSubcategoryDialog = ref(false)

  const currentCategory = ref<Category>()
  const currentSubcategory = ref<Subcategory>()

  const { showNotify } = useNotify()
  const { showDialog } = useDialog()

  // Is a category selected in the tree
  const isCategorySelected = computed(() => {
    return !!currentCategory.value?.id && !isSubcategorySelected.value
  })

  // Is a subcategory selected in the tree
  const isSubcategorySelected = computed(() => {
    return !!currentSubcategory.value?.id
  })

  // When the categories list changes, ensure an item in the tree is selected.
  // Note that after tree changes, the categories list is refetched by the parent component
  watch(
    () => props.categories,
    (newCategories: Category[]) => {
      if (selectedKey.value === undefined && newCategories?.length) {
        selectedKey.value = newCategories[0].id
        currentCategory.value = newCategories[0]
        emit('item-selected', newCategories[0])
      }
    },
    { immediate: true, deep: true }
  )

  // Is specified item selected in tree
  function isSelected(item: Category | Subcategory) {
    return selectedKey.value === item.id
  }

  // Item selected in tree
  function onSelected(item: Category | Subcategory) {
    selectedKey.value = item.id
    if (!isSubcategory(item)) {
      currentCategory.value = item
      currentSubcategory.value = undefined
    } else {
      currentSubcategory.value = item
      currentCategory.value = props.categories.find((cat) => cat.id === item.parentId)
    }

    emit('item-selected', item)
  }

  // When the Delete menu item is selected, determine wether to delete a category or subcategory
  function deleteItem() {
    if (isSubcategorySelected.value) {
      deleteSubcategory()
    } else {
      deleteCategory()
    }
  }

  // Expand all categories in the tree
  function expandAllCategories() {
    qTreeRef.value?.expandAll()
  }

  // Collapse all categories in the tree
  function collapseAllCategories() {
    qTreeRef.value?.collapseAll()
  }

  // Handle category added to tree
  function onCategoryAdded(category: Category) {
    if (!expandedKeys.value.includes(category.id)) {
      expandedKeys.value.push(category.id)
    }
    emit('tree-updated', category)
    showNotify({ message: 'Category added successfully', color: 'primary' })
  }

  // Handle category updated in tree
  function onCategoryUpdated(category: Category, subcategory?: Subcategory) {
    emit('tree-updated', category, subcategory)
    showNotify({ message: 'Category updated successfully', color: 'primary' })
  }

  // Handle subcategory added to tree
  function onSubcategoryAdded(category: Category, subcategory?: Subcategory) {
    if (!expandedKeys.value.includes(category.id)) {
      expandedKeys.value.push(category.id)
    }
    emit('tree-updated', category, subcategory)
    showNotify({ message: 'Subcategory added successfully', color: 'primary' })
  }

  // Handle subcategory updated in tree
  function onSubcategoryUpdated(category: Category, subcategory: Subcategory) {
    emit('tree-updated', category, subcategory)
    showNotify({ message: 'Subcategory updated successfully', color: 'primary' })
  }

  // Delete the selected Category
  async function deleteCategory() {
    showDialog({
      title: 'Confirm Delete Category',
      message: `Are you sure you want to delete category '${currentCategory.value?.name}'?`,
    }).onOk(async () => {
      try {
        const catId = currentCategory.value!.id
        const isCategoryInUse = await ExpenseService.isCategoryInUse(catId)
        if (!isCategoryInUse) {
          await CategoryService.deleteCategory(catId)
          selectedKey.value = undefined

          emit('tree-updated', currentCategory.value)
          showNotify({ message: 'Category deleted successfully', color: 'primary' })
        } else {
          showNotify({
            message: `Cannot delete category '${currentCategory.value!.name}'
              because it is already assigned to expenses`,
          })
        }
      } catch (error) {
        showNotify({ message: 'Error deleting the category' })
      }
    })
  }

  // Delete the subcategory from the category object
  async function deleteSubcategory() {
    showDialog({
      title: 'Confirm Delete Subcategory',
      message: `Are you sure you want to delete subcategory '${currentSubcategory.value?.name}'?`,
    }).onOk(async () => {
      try {
        const subcatId = currentSubcategory.value!.id

        const isSubcategoryInUse = await ExpenseService.isSubcategoryInUse(subcatId)
        if (!isSubcategoryInUse) {
          // Remove the subcategory from the category object
          const idx = currentCategory.value!.subcategories.findIndex(
            (subcat) => subcat.id === subcatId
          )
          if (idx !== -1) {
            currentCategory.value?.subcategories.splice(idx!, 1)
          }

          // Save the category
          await CategoryService.updateCategory(currentCategory.value!)

          // Just deleted the selected subcategory, so now select the parent category
          selectedKey.value = currentCategory.value?.id
          emit('tree-updated', currentCategory.value)
          showNotify({ message: 'Subcategory deleted successfully', color: 'primary' })
        } else {
          showNotify({
            message: `Cannot delete subcategory '${currentSubcategory.value!.name}'
              because it is already assigned to expenses`,
          })
        }
      } catch (error) {
        showNotify({ message: 'Error deleting the subcategory' })
      }
    })
  }
</script>

<style lang="scss" scoped>
  .selected {
    font-weight: bold;
    color: $primary;
  }
  :deep(.q-header__node-header) {
    width: 100% !important;
  }
  :deep(.q-tree__node-header-content .q-icon) {
    font-size: 16px !important;
  }
  :deep(.tree-btn.q-btn--round) {
    min-width: 1.3rem !important;
    min-height: 1.3rem !important;
  }
</style>
