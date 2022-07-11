<template>
  <q-dialog v-model="showDialog">
    <q-card>
      <q-toolbar class="bg-primary text-white">
        <q-toolbar-title>{{ dialogTitle }}</q-toolbar-title>
      </q-toolbar>

      <q-separator />

      <q-card-section>
        <q-form ref="form" v-model="isFormValid" greedy>
          <div v-if="dialogMessage" class="text-negative q-pb-md">
            {{ dialogMessage }}
          </div>

          <!-- Trx Date -->
          <div class="date-wrapper">
            <q-input
              v-model="tempExpense.trxDate"
              outlined
              dense
              readonly
              no-error-icon
              label="Start Date"
              mask="####-##-##"
              :rules="[ValidationUtil.isRequired]"
            >
              <q-menu ref="trxDateMenuRef">
                <q-date
                  v-model="tempExpense.trxDate"
                  minimal
                  mask="YYYY-MM-DD"
                  :options="ValidationUtil.isDateLeToday"
                  :events="(dt) => dt === tempExpense.trxDate"
                  @update:modelValue="trxDateMenuRef!.hide()"
                />
              </q-menu>
            </q-input>
          </div>

          <!-- Description -->
          <div>
            <q-input
              v-model="tempExpense.description"
              dense
              outlined
              required
              no-error-icon
              label="Description"
              class="description form-item"
              :rules="[ValidationUtil.isRequired]"
            />
          </div>

          <!-- Category -->
          <q-select
            v-model="tempExpense.categoryId"
            outlined
            dense
            emit-value
            map-options
            no-error-icon
            :options="categoriesQuery.data"
            label="Category"
            option-label="name"
            option-value="id"
            class="form-item"
            :rules="[ValidationUtil.isRequired]"
            @update:modelValue="tempExpense.subcategoryId = undefined"
          />

          <!-- Subcategory -->
          <q-select
            v-model="tempExpense.subcategoryId"
            outlined
            dense
            emit-value
            map-options
            no-error-icon
            :options="subcategories"
            label="Subcategory"
            option-label="name"
            option-value="id"
            class="form-item"
            :rules="[ValidationUtil.isRequired]"
          />

          <!-- Amount -->
          <q-input
            v-model.number="tempExpense.amount"
            dense
            outlined
            required
            no-error-icon
            label="Amount"
            class="form-item amount"
            :rules="[ValidationUtil.isRequired, ValidationUtil.isNumber]"
          />
        </q-form>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn flat color="primary" class="cancel-button" @click="close">Cancel</q-btn>
        <q-btn flat color="primary" class="save-button" @click="save">Save</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
  import { ref, computed, ComputedRef } from 'vue'
  import ExpenseService from '@/services/expense'
  import { Expense } from '@/types/expense'
  import { Category, Subcategory } from '@/types/category'
  import dayjs from 'dayjs'
  import { cloneDeep } from 'lodash-es'
  import { QForm, QMenu } from 'quasar'
  import ValidationUtil from '@/util/validation'
  import useCategories from '@/hooks/data/useCategories'
  import { QueryResponse } from '@/types/query'

  const props = defineProps<{
    modelValue: boolean
    expense: Expense
  }>()

  const emit = defineEmits(['update:modelValue', 'expense-updated'])

  const form = ref<QForm | null>(null)
  const trxDateMenuRef = ref<QMenu | null>(null)
  const isFormValid = ref(false)
  const tempExpense = ref<Expense>(cloneDeep(props.expense))
  const dialogMessage = ref('')

  if (tempExpense.value.trxDate) {
    tempExpense.value.trxDate = dayjs(tempExpense.value.trxDate).format('YYYY-MM-DD')
  }

  const dialogTitle = computed(() => {
    if (props.expense.id === undefined) {
      return 'Create Expense'
    }
    return 'Update Expense'
  })

  const showDialog = computed({
    get() {
      return props.modelValue
    },
    set(newValue) {
      emit('update:modelValue', newValue)
    },
  })

  // Retrieve the list of categories for the category and subcategory selects
  let categoriesQuery: ComputedRef<QueryResponse<Category[]>>
  try {
    categoriesQuery = useCategories()
  } catch (err) {
    dialogMessage.value = 'Error retrieving the category data'
  }

  // Create a category map for ease of category lookup by id
  const categoryMap = computed(() => {
    return categoriesQuery.value.data.reduce((map, obj) => {
      map[obj.id] = obj
      return map
    }, {})
  })

  // Look up the selected category by id from the category map
  const selectedCategory = computed(() => {
    if (!tempExpense.value.categoryId) return {}
    return categoryMap.value[tempExpense.value.categoryId] ?? {}
  })

  // Populate the subcategories from the selected category
  const subcategories = computed(() => {
    if (!selectedCategory.value) return []
    return selectedCategory.value.subcategories
  })

  // Validate and save the updated expense
  function save() {
    form.value?.validate().then(async (success) => {
      if (success) {
        // Verify that the categoryId and subcategoryId are valid
        const category = tempExpense.value.categoryId
          ? categoryMap.value[tempExpense.value.categoryId]
          : undefined
        if (!category) {
          tempExpense.value.categoryId = undefined
        } else {
          const subcategory = category.subcategories.find(
            (subcat: Subcategory) => subcat.id === tempExpense.value.subcategoryId
          )
          if (!subcategory) {
            tempExpense.value.subcategoryId = undefined
          }
        }

        try {
          await ExpenseService.saveExpense(tempExpense.value)
          emit('expense-updated', tempExpense)
          // Close the dialog
          close()
        } catch (error) {
          dialogMessage.value = 'Error saving the expense'
        }
      }
    })
  }

  // Close the dialog
  function close() {
    emit('update:modelValue', false)
  }
</script>

<style lang="scss" scoped>
  :deep(.q-field--outlined.q-field--readonly .q-field__control:before) {
    border-style: solid !important;
  }

  .form-item:not(:last-child) {
    margin: 12px 0px;
    width: 450px;
  }

  @media (max-width: $breakpoint-xs-max) {
    .form-item {
      width: 70vw;
    }
  }
</style>
