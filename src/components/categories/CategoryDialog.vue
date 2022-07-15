<template>
  <q-dialog v-model="showDialog">
    <q-card class="category-card">
      <q-toolbar class="bg-primary text-white">
        <q-toolbar-title>{{ dialogTitle }}</q-toolbar-title>
      </q-toolbar>

      <q-card-section>
        <q-form ref="form" class="form">
          <div class="text-negative">{{ dialogMessage }}</div>

          <q-input
            v-model="tempCategory.name"
            dense
            outlined
            autofocus
            maxlength="20"
            label="Category"
            :rules="[ValidationUtil.isRequired]"
          />

          <!--Subcategory List -->
          <fieldset class="subcategories rounded-borders">
            <legend>Subcategories</legend>

            <q-list dense class="subcategory-list">
              <q-item v-for="(subcat, idx) in tempCategory.subcategories" :key="idx" dense>
                <q-item-section> {{ subcat.name }} </q-item-section>
                <q-item-section side>
                  <q-btn
                    flat
                    round
                    size="sm"
                    icon="mdi-delete"
                    color="primary"
                    title="Delete Subcategory"
                    @click="deleteSubcategory(idx)"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </fieldset>

          <!-- Subcategory to add -->
          <div class="q-pt-lg">
            <q-space />
            <q-input v-model="newSubcategory" dense outlined label="New Subcategory">
              <template #append>
                <q-btn
                  size="sm"
                  icon="mdi-plus"
                  color="primary"
                  title="Add Subcategory"
                  @click="addSubcategory"
                />
              </template>
            </q-input>
          </div>
        </q-form>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn flat color="primary" @click="close">Cancel</q-btn>
        <q-btn flat color="primary" :="!tempCategory.name" @click="save">Save</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import CategoryService from '@/services/category'
  import { v4 as uuidv4 } from 'uuid'
  import { cloneDeep } from 'lodash-es'
  import { Category } from '@/types/category'
  import ValidationUtil from '@/util/validation'
  import { QForm } from 'quasar'

  const props = defineProps<{
    modelValue: boolean
    category?: Category
  }>()

  const emit = defineEmits(['update:modelValue', 'category-updated', 'category-added'])

  const dialogTitle = ref<string>(props.category?.id ? 'Update Category' : 'Add Category')
  const form = ref<QForm | null>(null)

  const showDialog = computed({
    get() {
      return props.modelValue
    },
    set(newValue) {
      emit('update:modelValue', newValue)
    },
  })

  const newSubcategory = ref<string>()
  const tempCategory = ref<Category>({ id: '', name: '', subcategories: [] })
  const isCategoryUnique = ref(true)
  const dialogMessage = ref<string>()

  if (props.category) {
    tempCategory.value = cloneDeep(props.category)
  }

  // Save the Category to the db
  async function save() {
    dialogMessage.value = undefined
    isCategoryUnique.value = true
    try {
      await CategoryService.saveCategory(tempCategory.value)
      if (props.category?.id) {
        emit('category-updated', tempCategory.value)
      } else {
        emit('category-added', tempCategory.value)
      }
      // Close the dialog
      close()
    } catch (error: unknown) {
      if (error && typeof error === 'string' && error.indexOf('Duplicate') !== -1) {
        dialogMessage.value = 'Category name is not unique'
      } else {
        console.error('Error saving category:', error)
        dialogMessage.value = 'Error saving the Category'
      }
    }
  }

  // Close the dialog
  function close() {
    emit('update:modelValue', false)
  }

  // Add the new subcategory to the list of subcategories
  function addSubcategory() {
    dialogMessage.value = undefined
    if (!newSubcategory.value) {
      return
    }
    // Verify subcategory name not already in the category list
    const sameName = tempCategory.value.subcategories.find(
      (sub) => sub.name.toLowerCase() === newSubcategory.value?.toLowerCase()
    )
    if (sameName) {
      newSubcategory.value = undefined
      return
    }
    const subcat = {
      id: uuidv4(),
      name: newSubcategory.value ?? '',
      parentId: tempCategory.value.id,
      matchText: [],
    }
    tempCategory.value.subcategories.push(subcat)
    newSubcategory.value = undefined
    tempCategory.value.subcategories.sort((sub1, sub2) => {
      return sub1.name.toLowerCase().localeCompare(sub2.name.toLowerCase())
    })
  }

  // Delete the subcategory from the list
  function deleteSubcategory(idx: number) {
    dialogMessage.value = undefined
    tempCategory.value.subcategories.splice(idx, 1)
  }
</script>

<style lang="scss" scoped>
  .subcategories {
    border: solid 1px #9a9a9a;
  }
  .subcategory-list {
    height: 100px;
    overflow-y: auto;
  }

  .category-card {
    width: 450px;
  }
  @media (max-width: $breakpoint-xs-max) {
    .category-card {
      width: 70vh;
    }
  }
</style>
