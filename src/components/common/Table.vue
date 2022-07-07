<template>
  <div>
    <div class="table-container">
      <q-table
        v-model:pagination="pagination"
        :grid="$q.screen.xs"
        :rows="tableRows"
        :columns="tableColumns"
        :row-key="rowKey"
        virtual-scroll
        :rows-per-page-options="[0]"
        hide-bottom
        flat
        dense
        @row-click="rowClicked"
      >
        <!-- Pass the table slots to the q-table component -->
        <template v-for="(index, name) in $slots" #[name]="data">
          <slot :name="name" v-bind="data" />
        </template>
      </q-table>
    </div>

    <div class="table-footer">{{ tableRows.length }} {{ rowText }}</div>
  </div>
</template>

<script setup lang="ts">
  import { Ref, ComputedRef } from 'vue'
  import { useQuasar, QTableColumn } from 'quasar'

  type TablePagination = {
    sortBy?: string | undefined
    descending?: boolean | undefined
    page?: number | undefined
    rowsPerPage?: number | undefined
    rowsNumber?: number | undefined
  }

  const props = withDefaults(
    defineProps<{
      tableRows: Record<string, any>[]
      tableColumns: QTableColumn<any>[]
      rowKey: string
      pagination?: TablePagination | undefined
      rowText: string
    }>(),
    {
      pagination: () => ({
        rowsPerPage: 0,
      }),
    }
  )

  const emit = defineEmits(['row-click'])

  const $q = useQuasar()

  function rowClicked(evt, rowObject: any) {
    emit('row-click', evt, rowObject)
  }
</script>

<style lang="scss" scoped>
  .table-container {
    border: solid 1px #ededed !important;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    height: calc(100vh - 305px);
    overflow: auto;
  }

  .table-footer {
    font-size: 13px;
    font-weight: bold;
    color: #555555;
    border: solid 1px #ededed !important;
    border-top: none !important;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    padding: 12px 16px;
  }
</style>
