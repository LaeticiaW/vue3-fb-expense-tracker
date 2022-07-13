<template>
  <div>
    <div class="table-container">
      <q-table
        v-model:pagination="tablePagination"
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

    <div class="table-footer row">
      <span>{{ tableRows.length }} {{ rowText }}</span>
      <q-space />
      <span v-if="footerLabel">{{ footerLabel }}: {{ footerValue }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useQuasar } from 'quasar'

  type TablePagination = {
    sortBy?: string | undefined
    descending?: boolean | undefined
    page?: number | undefined
    rowsPerPage?: number | undefined
    rowsNumber?: number | undefined
  }

  const props = withDefaults(
    defineProps<{
      tableRows: Record<string, unknown>[]
      // tableColumns: QTableColumn<any>[]
      tableColumns: any[]
      rowKey: string
      modelPagination?: TablePagination | undefined
      rowText: string
      footerLabel?: string
      footerValue?: string | number
    }>(),
    {
      modelPagination: () => ({
        rowsPerPage: 0,
      }),
      footerLabel: undefined,
      footerValue: undefined,
    }
  )

  const emit = defineEmits(['row-click', 'update:modelPagination'])

  const $q = useQuasar()

  // Computed value to prevent modifying modelPagination prop
  const tablePagination = computed({
    get() {
      return props.modelPagination
    },
    set(newValue) {
      emit('update:modelPagination', newValue)
    },
  })

  function rowClicked(evt: Event, rowObject: unknown) {
    emit('row-click', evt, rowObject)
  }
</script>

<style lang="scss" scoped>
  .table-container {
    padding-left: 1px;
    padding-right: 1px;
    border: solid 1px #ededed !important;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    max-height: calc(100vh - 280px);
    overflow: auto;
  }

  .table-footer {
    font-size: 13px;
    font-weight: bold;
    color: #555555;
    border: solid 1px #ededed;
    border-top: none;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    padding: 12px 16px;
  }

  @media (max-width: $breakpoint-xs-max) {
    .table-container {
      height: auto;
      border-top-style: none !important;
      border-left-style: none !important;
      border-right-style: none !important;
    }
    .q-card {
      padding-top: 0px;
    }
  }
</style>
