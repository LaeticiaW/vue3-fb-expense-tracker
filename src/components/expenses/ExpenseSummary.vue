<template>
  <div class="page">
    <page-header title="Expense Summary" />
    <page-error :error="expenseTotalsQuery.error ?? selectCategoriesQuery.error" />

    <div>
      <!-- Filter -->
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
      </TableFilter>

      <!-- Data Table -->
      <Table
        :table-rows="tableRows"
        :table-columns="tableColumns"
        row-key="categoryId"
        :row-text="rowText"
        footer-label="Total Amount"
        :footer-value="totalExpensesAmount"
        @row-click="rowClicked"
      >
        <template #header="props">
          <q-tr :props="props">
            <q-th auto-width />
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <template #body="props">
          <q-tr :props="props">
            <q-td auto-width>
              <q-btn
                size="xs"
                color="primary"
                round
                dense
                :icon="props.expand ? 'remove' : 'add'"
                style="margin-left: 16px"
                @click="props.expand = !props.expand"
              />
            </q-td>
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.value }}
            </q-td>
          </q-tr>
          <q-tr v-show="props.expand" :props="props" class="expanded-row">
            <td colspan="4" class="expanded-area">
              <table class="subcategory-table full-width">
                <tbody>
                  <tr v-for="(subcat, idx) in props.row.subcategoryTotals" :key="idx">
                    <td></td>
                    <td>{{ subcat.subcategoryName || 'Unknown' }}</td>
                    <td class="subcategory-amount">
                      <span class="float-right">{{ subcat.totalAmount.toFixed(2) }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div v-if="!props.row.subcategoryTotals.length" class="no-subcategories">
                No Subcategory Data
              </div>
            </td>
          </q-tr>
        </template>

        <template #item="props">
          <ExpenseSummaryGridItem :item-props="props" />
        </template>
      </Table>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, ComputedRef } from 'vue'
  import TableFilter from '@/components/common/TableFilter.vue'
  import DateRangeInput from '@/components/common/DateRangeInput.vue'
  import ExpenseSummaryGridItem from '@/components/expenses/ExpenseSummaryGridItem.vue'
  import dayjs from 'dayjs'
  import PageHeader from '@/components/common/PageHeader.vue'
  import PageError from '@/components/common/PageError.vue'
  import CategorySelect from '@/components/common/CategorySelect.vue'
  import { useNotify } from '@/hooks/useNotify'
  import { ExpenseFilter, ExpenseSummary, ExpenseTotal } from '@/types/expense'
  import useCategorySelect from '@/hooks/data/useCategorySelect'
  import useExpenseTotals from '@/hooks/data/useExpenseTotals'
  import { QTableColumn } from 'quasar'
  import { useLoading } from '@/hooks/useLoading'
  import Table from '@/components/common/Table.vue'

  const filter: ExpenseFilter = {
    startDate: ref(dayjs().startOf('year').format('YYYY-MM-DD')),
    endDate: ref(dayjs().format('YYYY-MM-DD')),
    categoryIds: ref<string[]>([]),
  }

  const tableColumns: QTableColumn<ExpenseTotal>[] = [
    {
      name: 'categoryName',
      label: 'Category',
      field: 'categoryName',
      align: 'left',
      sortable: true,
    },
    {
      name: 'percent',
      label: 'Percent',
      field: 'percentage',
      align: 'right',
      sortable: true,
      format: (val) => val.toFixed(2),
    },
    {
      name: 'totalAmount',
      label: 'Amount',
      field: 'totalAmount',
      align: 'right',
      sortable: true,
      format: (val) => val.toFixed(2),
    },
  ]

  const { showNotify } = useNotify()
  const { queryLoading } = useLoading()

  // Retrieve the expense totals and select category data
  const expenseTotalsQuery = useExpenseTotals(filter)
  const selectCategoriesQuery = useCategorySelect()
  queryLoading([expenseTotalsQuery, selectCategoriesQuery])

  // Table data rows
  const tableRows = computed(() => {
    return expenseTotalsQuery?.value?.data ?? []
  })

  // Table footer text
  const rowText = computed(() => {
    return tableRows.value.length !== 1 ? 'rows' : 'row'
  })

  const totalExpensesAmount = computed(() => {
    const value = expenseTotalsQuery.value.data.reduce(
      (sum: number, cat: ExpenseTotal) => sum + Number(cat.totalAmount),
      0
    )
    return value.toFixed(2)
  })

  // Collapse expanded rows whenever new data is retrieved, put in watch?  computed?
  // expanded.value.shift()

  // Handle manually expanding/collapsing rows on row click (vs expand icon click)
  function rowClicked(item: ExpenseSummary) {
    // if (expanded.value.length && expanded.value[0] === item) {
    //   expanded.value.shift()
    // } else {
    //   expanded.value.shift()
    //   expanded.value.push(item)
    // }
  }
</script>

<style lang="scss" scoped>
  td {
    padding: 12px !important;
  }

  .no-subcategories {
    padding-left: 24px;
    background-color: #e9e8f4;
  }

  .expanded-row {
    background-color: $blue-grey-1;
  }
  expanded-row:hover {
    background-color: #f7f7f7;
  }
  td.expanded-area {
    border-width: 0px !important;
    border-style: none !important;
    padding-top: 0px !important;
    padding-bottom: 0px !important;
  }
  // Prevent double border above footer
  .q-tr:nth-last-child(2) .q-td {
    border-width: 0px !important;
    border-style: none !important;
  }
  .subcategory-amount {
    padding-right: 0px !important;
  }

  @media (max-width: $breakpoint-xs-max) {
    .category-dropdown {
      margin-top: 4px;
    }
    :deep(.table-container) {
      max-height: calc(100vh - 200px) !important;
    }
  }
</style>
