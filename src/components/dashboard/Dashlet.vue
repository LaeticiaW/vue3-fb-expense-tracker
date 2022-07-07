<template>
  <div class="dashlet shadow-2">
    <q-toolbar class="text-primary">
      <q-toolbar-title>
        {{ options.dashletTitle }}
      </q-toolbar-title>

      <!-- Dashlet actions slot -->
      <slot name="actions" />

      <!-- Maximize and Minimize buttons -->
      <q-btn v-if="!expanded" round dense icon="mdi-fullscreen" color="primary" @click="maximize" />
      <q-btn
        v-if="expanded"
        round
        dense
        color="primary"
        icon="mdi-fullscreen-exit"
        @click="minimize"
      />
    </q-toolbar>

    <q-separator />

    <div class="dashlet-content">
      <!-- Dashlet content slot -->
      <slot name="content" />
    </div>
  </div>
</template>

<script setup lang="ts">
  /*
   * This is a common Dashlet component used by all dashboard dashlets for a common look and feel
   */
  import { GridItemData } from '@/types/vue3-grid-layout'
  import { inject, ref, PropType } from 'vue'

  // Options contains vue-grid-item options plus component and dashletTitle properties
  const props = defineProps({
    options: {
      type: Object as PropType<GridItemData>,
      required: true,
    },
  })

  const dashboardContext: any = inject('dashboardContext')

  const expanded = ref(false)

  // Maximize the dashlet
  const maximize = () => {
    expanded.value = true
    dashboardContext.maximizeDashlet?.(props.options)
  }

  // Minimize the dashlet
  const minimize = () => {
    expanded.value = false
    dashboardContext.minimizeDashlet?.()
  }
</script>

<style lang="scss" scoped>
  .dashlet {
    position: relative;
    height: 100%;

    .dashlet-content {
      padding: 0px 24px 12px 24px;
      height: calc(100% - 80px);
    }

    :deep(.q-toolbar__title) {
      font-size: 1rem !important;
      line-height: 1 !important;
      font-weight: 500;
      min-width: 160px;
    }
  }
</style>
