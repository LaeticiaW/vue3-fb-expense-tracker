<template>
  <q-card class="full-width q-pa-md q-mb-md">
    <div class="row">
      <div
        v-for="(col, idx) in props.itemProps.cols"
        :key="col.name"
        class="col-4"
        :class="{ 'text-right': idx === 2 }"
      >
        <div class="grid-label">{{ col.label }}</div>
        <div class="grid-value q-mb-sm">{{ col.value }}</div>
      </div>

      <div class="col-12 text-weight-medium">Subcategories:</div>
      <div class="col-12 q-pl-md">
        <div
          v-for="subcat in props.itemProps.row.subcategoryTotals"
          :key="subcat.subcategoryId"
          class="row"
        >
          <div class="col-4">{{ subcat.subcategoryName || 'Unknown' }}</div>
          <div class="col-4" />
          <div class="col-4 text-right">{{ subcat.totalAmount.toFixed(2) }}</div>
        </div>
      </div>
    </div>
  </q-card>
</template>

<script setup lang="ts">
  import { ExpenseTotal } from '@/types/expense'
  import { GridItemProps } from '@/types/table'

  const props = defineProps<{
    itemProps: GridItemProps<ExpenseTotal>
  }>()
</script>

<style lang="scss" scoped>
  .grid-label {
    opacity: 0.54;
    font-size: 12px;
  }
</style>
