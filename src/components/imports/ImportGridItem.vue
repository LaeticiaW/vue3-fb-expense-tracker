<template>
  <q-card class="full-width q-py-md q-mb-md">
    <q-list dense>
      <q-item v-for="col in tableColumns" :key="col.name">
        <q-item-section>
          <div v-if="col.label === 'Date'" class="row justify-between">
            <div>
              <q-item-label class="grid-label text-weight-medium">{{ col.label }}</q-item-label>
              <q-item-label class="grid-value q-mb-sm">{{ col.value }}</q-item-label>
            </div>
            <div>
              <q-btn
                round
                flat
                icon="mdi-delete"
                color="primary"
                size="sm"
                class="q-ma-xs"
                @click="deleteImport"
              />
            </div>
          </div>
          <div v-else>
            <q-item-label class="grid-label">{{ col.label }}</q-item-label>
            <q-item-label class="grid-value q-mb-sm">{{ col.value }}</q-item-label>
          </div>
        </q-item-section>
      </q-item>
    </q-list>
  </q-card>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { Import } from '@/types/import'
  import { GridItemProps } from '@/types/table'
  import { QTableColumn } from 'quasar'

  const props = defineProps<{
    itemProps: GridItemProps<Import>
  }>()

  const emit = defineEmits(['update', 'delete'])

  const tableColumns = computed(() => {
    return props.itemProps.cols.filter((col: QTableColumn) => col.label !== 'Actions')
  })

  function deleteImport() {
    emit('delete', props.itemProps.row)
  }
</script>

<style lang="scss" scoped>
  .grid-label {
    opacity: 0.54;
    font-size: 12px;
  }
</style>
