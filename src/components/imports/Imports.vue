<template>
  <div class="page">
    <page-header title="Import Expenses" />
    <page-error :error="importsQuery.error" />

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
          </div>
        </template>

        <template #actions>
          <q-btn
            round
            icon="mdi-publish"
            color="primary"
            size="sm"
            class="import-expenses-btn q-ml-sm"
            @click="openImportDialog"
          />
        </template>
      </TableFilter>

      <!-- Data Table -->
      <Table :table-rows="tableRows" :table-columns="tableColumns" row-key="id" :row-text="rowText">
        <template #body-cell-actions="props">
          <q-td :props="props">
            <q-btn
              round
              flat
              icon="mdi-delete"
              color="primary"
              size="sm"
              class="q-ma-xs"
              @click="deleteImportedExpenses(props.row)"
            />
          </q-td>
        </template>

        <template #item="props">
          <!--
          <ExpenseGridItem :item-props="props" />
          -->
        </template>
      </Table>
    </div>
    <!-- Import Expenses Dialog -->
    <ImportDialog
      v-if="showImportDialog"
      v-model="showImportDialog"
      @file-imported="importsQuery.fetch()"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import ImportDialog from '@/components/imports/ImportDialog.vue'
  import dayjs from 'dayjs'
  import ImportService from '@/services/import'
  import TableFilter from '@/components/common/TableFilter.vue'
  import DateRangeInput from '@/components/common/DateRangeInput.vue'
  import PageHeader from '@/components/common/PageHeader.vue'
  import PageError from '@/components/common/PageError.vue'
  import { useNotify } from '@/hooks/useNotify'
  import { useDialog } from '@/hooks/useDialog'
  import { useLoading } from '@/hooks/useLoading'
  import useImports from '@/hooks/data/useImports'
  import Table from '@/components/common/Table.vue'
  import { Import, ImportFilter } from '@/types/import'
  import { QTableColumn } from 'quasar'

  const filter: ImportFilter = {
    startDate: ref(dayjs().startOf('year').format('YYYY-MM-DD')),
    endDate: ref(dayjs().format('YYYY-MM-DD')),
  }

  const showImportDialog = ref(false)

  const defaultCol: Omit<QTableColumn<Import>, 'name' | 'label' | 'field'> = {
    align: 'left',
    sortable: true,
  }

  const tableColumns: QTableColumn<Import>[] = [
    { ...defaultCol, name: 'importDate', label: 'Date', field: 'importDate' },
    { ...defaultCol, name: 'fileName', label: 'File Name', field: 'fileName' },
    { ...defaultCol, name: 'description', label: 'Description', field: 'description' },
    { ...defaultCol, name: 'recordCount', label: 'Records', field: 'recordCount', align: 'right' },
    { name: 'actions', label: 'Actions', field: 'id', align: 'right', sortable: false },
  ]

  const { showNotify } = useNotify()
  const { showDialog } = useDialog()
  const { queryLoading } = useLoading()

  // Retrieve the import data
  const importsQuery = useImports(filter)
  queryLoading([importsQuery])

  // Table data rows
  const tableRows = computed(() => {
    return importsQuery?.value?.data ?? []
  })

  // Table footer text
  const rowText = computed(() => {
    return tableRows.value.length !== 1 ? 'rows' : 'row'
  })

  // Delete the import summary and all associated expenses
  async function deleteImportedExpenses(importItem: Import) {
    showDialog({
      title: 'Confirm Delete Imported Expenses',
      message:
        `Are you sure you want to delete all` +
        ` ${importItem.recordCount} expenses associated with this import?`,
    }).onOk(async () => {
      try {
        await ImportService.deleteImport(importItem.id)
        importsQuery.value.fetch()
        showNotify({ message: 'Successfully deleted imported expenses', color: 'primary' })
      } catch (error) {
        console.error('Error deleting imported expenses:', error)
        showNotify({ message: 'Error deleting imported expenses' })
      }
    })
  }

  function openImportDialog() {
    showImportDialog.value = true
  }
</script>
