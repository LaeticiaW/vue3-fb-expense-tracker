<template>
  <div ref="rootEl" class="dashboard-container">
    <page-header title="Dashboard" class="q-mb-none" />

    <GridLayout
      v-bind="dashboardOptions"
      :layout="dashboardLayout"
      :class="{ hidelayout: hideLayout }"
      @layout-updated="layoutUpdated"
      @updated="layoutUpdated"
    >
      <GridItem v-for="item in dashboardLayout" v-bind="item" :id="item.i" :key="item.i">
        <component
          :is="item.component"
          :options="item"
          @maximize="maximizeDashlet(item)"
          @minimize="minimizeDashlet()"
        />
      </GridItem>
    </GridLayout>
  </div>
</template>

<script lang="ts">
  import { defineComponent, provide, onMounted, ref, nextTick } from 'vue'
  import VueGridLayout from 'vue3-grid-layout'
  import { GridItemData } from 'vue3-grid-layout'
  import PageHeader from '../common/PageHeader.vue'
  import type { document } from '@/types/document'
  import CategoryExpensesChart from '@/components/dashboard/dashlets/CategoryExpensesChart.vue'
  import ExpensesOverTimeChart from '@/components/dashboard/dashlets/ExpensesOverTimeChart.vue'

  export default defineComponent({
    name: 'Dashboard',
    components: {
      GridLayout: VueGridLayout.GridLayout,
      GridItem: VueGridLayout.GridItem,
      PageHeader,
      CategoryExpensesChart,
      ExpensesOverTimeChart,
    },
    setup() {
      const rootEl = ref<HTMLElement | null>(null)
      const hideLayout = ref(false)
      const defaultSize = {
        w: 6,
        h: 4,
        minH: 3,
        minW: 4,
      }

      const dashboardOptions = {
        colNum: 12,
        rowHeight: 80,
        isDraggable: true,
        isResizable: true,
        isMirrored: false,
        verticalCompact: true,
        margin: [24, 24, 24, 24],
        useCssTransforms: false,
        autoSize: true,
      }

      const dashboardLayout = [
        {
          x: 0,
          y: 0,
          i: '0',
          ...defaultSize,
          component: 'CategoryExpensesChart',
          dashletTitle: 'Expenses By Category',
        },
        {
          x: 6,
          y: 0,
          i: '1',
          ...defaultSize,
          component: 'ExpensesOverTimeChart',
          dashletTitle: 'Expenses Over Time',
        },
      ]

      // When the layout is updated, trigger a window resize event so that the charts will
      // display correctly
      const layoutUpdated = () => {
        triggerWindowResize()
      }

      // Maximize the specified dashlet - make it full screen size
      const maximizeDashlet = (dashletOptions: GridItemData) => {
        hideLayout.value = true

        // Set the'hide' class on all vue grid items except for the one that is maximized
        const allGridItems = rootEl.value?.querySelectorAll('.vue-grid-item') || []
        const elList: Element[] = Array.from(allGridItems)
        elList.forEach((el: Element) => {
          el.classList.add('hide')
        })

        const maximizeGridItem: Element | null | undefined = rootEl.value?.querySelector(
          `.vue-grid-item[id="${dashletOptions.i}"]`
        )

        maximizeGridItem?.classList.remove('hide')
        maximizeGridItem?.classList.add('maximize')

        triggerWindowResize()
      }

      // Minimize the dashlets
      const minimizeDashlet = () => {
        hideLayout.value = false

        const allGridItems = rootEl.value?.querySelectorAll('.vue-grid-item') || []
        const elList = Array.from(allGridItems)
        elList.forEach((el: Element) => {
          el.classList.remove('hide')
          el.classList.remove('maximize')
        })
        triggerWindowResize()
      }

      // Trigger a window resize event.  This is used to fix chart rendering issues.
      const triggerWindowResize = () => {
        nextTick(() => {
          if ((document as any)?.documentMode && (document as any)?.documentMode <= 11) {
            // For IE 11
            const evt = window.document.createEvent('UIEvents')
            evt.initUIEvent('resize', true, false, window, 0)
            window.dispatchEvent(evt)
          } else {
            // For Chrome, Firefox, and IE > 11
            window.dispatchEvent(new Event('resize'))
          }
        })
      }

      // On mount, trigger a window resize event so that the charts display correctly
      onMounted(() => {
        setTimeout(() => {
          triggerWindowResize()
        }, 0)
      })

      // Provide the maximize and minimize dashlet methods to the Dashlet component
      provide('dashboardContext', {
        maximizeDashlet: maximizeDashlet,
        minimizeDashlet: minimizeDashlet,
      })

      return {
        dashboardLayout,
        dashboardOptions,
        layoutUpdated,
        maximizeDashlet,
        minimizeDashlet,
        hideLayout,
        rootEl,
      }
    },
  })
</script>

<style lang="scss" scoped>
  .dashboard-container {
    // padding-left: 8px;
    // padding-right: 8px;
  }

  .vue-grid-item.hide {
    display: none !important;
  }

  .vue-grid-item.maximize {
    top: 24px !important;
    left: 24px !important;
    width: 96% !important;
    height: calc(100vh - 180px) !important;
  }

  // For responsive dashboard behavior
  @media only screen and (max-width: 1024px) {
    :deep(.vue-grid-layout) {
      height: auto !important;
    }
    :deep(.vue-grid-item) {
      position: relative !important;
      width: 100% !important;
      top: inherit !important;
      left: 0px !important;
      transform: inherit !important;
      margin-bottom: 24px !important;
    }
  }
</style>
