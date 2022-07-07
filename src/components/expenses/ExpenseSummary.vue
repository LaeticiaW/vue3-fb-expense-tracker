<template>
  <div class="page">
    <page-header title="Expense Summary" />

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
          <q-tr v-show="props.expand" :props="props">
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
        <!--
        <template #item="props">

          <ExpenseSummaryGridItem :item-props="props" />

        </template>
        -->
      </Table>

      <!--
      <div class="table-footer" style="position: relative">
        <v-toolbar flat dense>
          <span>{{ expenseTotalsQuery.data.length }} {{ rowText }}</span>
          <v-spacer />
          <span>Total Amount: {{ totalExpensesAmount }}</span>
        </v-toolbar>
      </div>
      -->
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, ComputedRef } from 'vue'
  import TableFilter from '@/components/common/TableFilter.vue'
  import DateRangeInput from '@/components/common/DateRangeInput.vue'
  import dayjs from 'dayjs'
  import PageHeader from '@/components/common/PageHeader.vue'
  import CategorySelect from '@/components/common/CategorySelect.vue'
  import { useNotify } from '@/hooks/useNotify'
  import { ExpenseFilter, ExpenseSummary, ExpenseTotal } from '@/types/expense'
  import useCategorySelect from '@/hooks/data/useCategorySelect'
  import useExpenseTotals from '@/hooks/data/useExpenseTotals'
  import { QTableColumn } from 'quasar'
  import { QueryResponse } from '@/types/query'
  import { SelectCategory } from '@/types/category'
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

  let expenseTotalsQuery: ComputedRef<QueryResponse<ExpenseTotal[]>>
  let selectCategoriesQuery: ComputedRef<QueryResponse<SelectCategory[]>>
  try {
    expenseTotalsQuery = useExpenseTotals(filter)
    selectCategoriesQuery = useCategorySelect()
    // queryLoading([expenseTotalsQuery, selectCategoriesQuery])
    queryLoading(expenseTotalsQuery)
    queryLoading(selectCategoriesQuery)
  } catch (err) {
    showNotify({ message: 'Error retrieving data' })
  }

  const rowText = computed(() => {
    return expenseTotalsQuery.value.data.length !== 1 ? 'rows' : 'row'
  })

  const tableRows = computed(() => {
    return expenseTotalsQuery?.value?.data ?? []
  })

  const totalExpensesAmount = computed(() => {
    return expenseTotalsQuery.value.data.reduce(
      (sum: number, cat: ExpenseTotal) => sum + Number(cat.totalAmount),
      0
    )
  })

  // Collapse any expanded row whenever new data is retrieved, put in watch?  computed?
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
  .expanded-area,
  .expanded-area:hover {
    // background-color: #e9e8f4;
    background-color: $blue-grey-1;
    .subcategory-table {
      td {
        // background-color: #e9e8f4;
        background-color: $blue-grey-1;
      }
      tr:hover,
      td:hover {
        background-color: $blue-grey-1 !important;
      }
      .subcategory-amount {
        padding-right: 0px !important;
      }
    }
  }
</style>
