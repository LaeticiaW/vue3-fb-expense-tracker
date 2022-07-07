<template>
  <div class="page">
    <page-header title="Manage Expenses" />

    <div>
      <!-- Filter -->
      <TableFilter :enable-prominent="true">
        <template #inputs>
          <div class="row">
            <!-- Start and end dates -->
            <date-range-input
              v-model:startDate="filter.startDate"
              v-model:endDate="filter.endDate"
            />
            <!-- Category -->
            <category-select
              :model-value="filter.categoryIds"
              :items="selectCategoriesQuery.data"
              label="Category"
              @update:modelValue="filter.categoryIds.value = $event"
            />
          </div>
        </template>

        <template #actions>
          <q-btn
            round
            icon="mdi-plus"
            color="primary"
            size="sm"
            class="create-expense-btn q-ml-sm"
            @click="showAddExpenseDialog"
          />
        </template>
      </TableFilter>

      <!-- Data Table -->
      <Table
        flat
        :table-rows="tableRows"
        :table-columns="tableColumns"
        row-key="_id"
        :row-text="rowText"
        @row-click="rowClicked"
      >
        <template #body-cell-actions="props">
          <q-td :props="props">
            <q-btn
              round
              flat
              icon="mdi-pencil"
              color="primary"
              size="sm"
              class="a-ma-xs"
              @click="updateExpense(props.row)"
            />
            <q-btn
              round
              flat
              icon="mdi-delete"
              color="primary"
              size="sm"
              class="q-ma-xs"
              @click="deleteExpense(props.row)"
            />
          </q-td>
        </template>

        <template #item="props">
          <ExpenseGridItem :item-props="props" />
        </template>
      </Table>
    </div>

    <!-- Update Expense Dialog -->
    <ExpenseDialog
      v-if="showExpenseDialog"
      v-model="showExpenseDialog"
      :expense="selectedExpense"
      @expense-updated="expenseUpdated"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, ComputedRef } from 'vue'
  import dayjs from 'dayjs'
  import TableFilter from '@/components/common/TableFilter.vue'
  import DateRangeInput from '@/components/common/DateRangeInput.vue'
  import PageHeader from '@/components/common/PageHeader.vue'
  import CategorySelect from '@/components/common/CategorySelect.vue'
  import useExpenses from '@/hooks/data/useExpenses'
  import useCategorySelect from '@/hooks/data/useCategorySelect'
  import ExpenseDialog from '@/components/expenses/ExpenseDialog.vue'
  import ExpenseGridItem from '@/components/expenses/ExpenseGridItem.vue'
  import { QTableColumn } from 'quasar'
  import { QueryResponse } from '@/types/query'
  import { SelectCategory } from '@/types/category'
  import { Expense } from '@/types/expense'
  import { useNotify } from '@/hooks/useNotify'
  import { useDialog } from '@/hooks/useDialog'
  import { useLoading } from '@/hooks/useLoading'
  import Table from '@/components/common/Table.vue'
  import { ExpenseFilter } from '@/types/expense'

  const filter: ExpenseFilter = {
    startDate: ref(dayjs().startOf('year').format('YYYY-MM-DD')),
    endDate: ref(dayjs().format('YYYY-MM-DD')),
    categoryIds: ref<string[]>([]),
  }

  const showExpenseDialog = ref(false)
  const selectedExpense = ref()
  const addExpense = ref(false)

  const defaultCol: Omit<QTableColumn<Expense>, 'name' | 'label' | 'field'> = {
    align: 'left',
    sortable: true,
  }

  const tableColumns: QTableColumn<Expense>[] = [
    { ...defaultCol, name: 'trxDate', label: 'Date', field: 'trxDate' },
    { ...defaultCol, name: 'description', label: 'Description', field: 'description' },
    { ...defaultCol, name: 'categoryName', label: 'Category', field: 'categoryName' },
    { ...defaultCol, name: 'subcategoryName', label: 'Subcategory', field: 'subcategoryName' },
    {
      ...defaultCol,
      name: 'amount',
      label: 'Amount',
      field: 'amount',
      align: 'right',
      sortable: false,
      format: (val) => val.toFixed(2),
    },
    { name: 'actions', label: 'Actions', field: '_id', align: 'left' },
  ]

  const { showNotify } = useNotify()
  const { showDialog } = useDialog()
  const { queryLoading } = useLoading()

  // Retrieve the expense and category data
  let expensesQuery: ComputedRef<QueryResponse<Expense[]>>
  let selectCategoriesQuery: ComputedRef<QueryResponse<SelectCategory[]>>
  try {
    expensesQuery = useExpenses(filter)
    selectCategoriesQuery = useCategorySelect()

    // queryLoading([expensesQuery, selectCategoriesQuery])
    queryLoading(expensesQuery)
    queryLoading(selectCategoriesQuery)
  } catch (err) {
    showNotify({ message: 'Error retrieving data' })
  }

  const tableRows = computed(() => {
    return expensesQuery?.value?.data ?? []
  })

  const rowText = computed(() => {
    return tableRows.value.length !== 1 ? 'rows' : 'row'
  })

  // When a table row is clicked, save that expense as the selectedExpense
  function rowClicked(evt, expense) {
    selectedExpense.value = expense
  }

  // Display the add expense dialog
  function showAddExpenseDialog() {
    showExpenseDialog.value = true
    addExpense.value = true
    selectedExpense.value = {
      trxDate: null,
      categoryId: null,
      subcategoryId: null,
      amount: null,
    }
  }

  // Display the update expense dialog
  function updateExpense(expense: Expense) {
    selectedExpense.value = expense
    showExpenseDialog.value = true
    addExpense.value = false
  }

  // Delete the expense
  function deleteExpense(expense: Expense) {
    showDialog({
      title: 'Confirm Delete Expense',
      message: `Are you sure you want to delete expense ${expense.amount}?`,
    }).onOk(async () => {
      try {
        // NEED TO DELETE HERE
        expensesQuery.value.fetch()
        showNotify({ message: 'Expense deleted successfully', color: 'primary' })
      } catch (error) {
        console.error('Error deleting expenses:', error)
        showNotify({ message: 'Error deleting the expense' })
      }
    })
  }

  // Expense has been updated, refresh the expenses data
  function expenseUpdated() {
    expensesQuery.value.fetch()
    if (addExpense.value) {
      showNotify({ message: 'Expense added successfully', color: 'primary' })
    } else {
      showNotify({ message: 'Expense updated successfully', color: 'primary' })
    }
  }
</script>
