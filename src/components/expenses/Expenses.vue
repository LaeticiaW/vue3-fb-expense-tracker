<template>
  <div class="page">
    <page-header title="Manage Expenses" />
    <page-error :error="expensesQuery.error ?? selectCategoriesQuery.error" />

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
              class="category-dropdown"
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
            title="Create Expense"
            @click="showAddExpenseDialog"
          />
        </template>
      </TableFilter>

      <!-- Data Table -->
      <Table
        flat
        :table-rows="tableRows"
        :table-columns="tableColumns"
        row-key="id"
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
              title="Update Expense"
              @click="updateExpense(props.row)"
            />
            <q-btn
              round
              flat
              icon="mdi-delete"
              color="primary"
              size="sm"
              class="q-ma-xs"
              title="Delete Expense"
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
  import { ref, computed } from 'vue'
  import dayjs from 'dayjs'
  import Table from '@/components/common/Table.vue'
  import TableFilter from '@/components/common/TableFilter.vue'
  import DateRangeInput from '@/components/common/DateRangeInput.vue'
  import PageHeader from '@/components/common/PageHeader.vue'
  import PageError from '@/components/common/PageError.vue'
  import CategorySelect from '@/components/common/CategorySelect.vue'
  import useExpenses from '@/hooks/data/useExpenses'
  import useCategorySelect from '@/hooks/data/useCategorySelect'
  import ExpenseDialog from '@/components/expenses/ExpenseDialog.vue'
  import ExpenseGridItem from '@/components/expenses/ExpenseGridItem.vue'
  import ExpenseService from '@/services/expense'
  import { QTableColumn } from 'quasar'
  import { Expense } from '@/types/expense'
  import { useNotify } from '@/hooks/useNotify'
  import { useDialog } from '@/hooks/useDialog'
  import { useLoading } from '@/hooks/useLoading'

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
      sortable: true,
      sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
      format: (val) => (typeof val === 'number' ? val.toFixed(2) : val),
    },
    { name: 'actions', label: 'Actions', field: 'id', align: 'left' },
  ]

  const { showNotify } = useNotify()
  const { showDialog } = useDialog()
  const { queryLoading } = useLoading()

  // Retrieve the expenses and category select data
  const expensesQuery = useExpenses(filter)
  const selectCategoriesQuery = useCategorySelect()
  queryLoading([expensesQuery, selectCategoriesQuery])

  // Table data rows
  const tableRows = computed(() => {
    return expensesQuery.value.data ?? []
  })

  // Table footer text
  const rowText = computed(() => {
    return tableRows.value.length !== 1 ? 'rows' : 'row'
  })

  // When a table row is clicked, set the selectedExpense
  function rowClicked(evt: Event, expense: Expense) {
    selectedExpense.value = expense
  }

  // Display the expense dialog for create
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

  // Display the expense dialog for update
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
        ExpenseService.deleteExpense(expense.id!)
        expensesQuery.value.fetch()
        showNotify({ message: 'Expense deleted successfully', color: 'primary' })
      } catch (error) {
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

<style lang="scss" scoped>
  @media (max-width: $breakpoint-xs-max) {
    .category-dropdown {
      margin-top: 4px;
    }
  }
</style>
