<template>
  <div ref="rootEl" class="dashboard-container">
    <page-header title="Dashboard" class="q-mb-none" />

    <div class="dashboard q-pt-lg" :class="{ hidelayout: hideLayout }">
      <div class="row">
        <div
          v-for="item in dashboardLayout"
          :id="item.id"
          :key="item.id"
          class="dashlet-container col-12 col-md-6"
        >
          <component
            :is="item.component"
            :options="item"
            class=""
            @maximize="maximizeDashlet(item)"
            @minimize="minimizeDashlet()"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, provide, ref, nextTick } from 'vue'
  import PageHeader from '@/components/common/PageHeader.vue'
  import CategoryExpensesChart from '@/components/dashboard/dashlets/CategoryExpensesChart.vue'
  import ExpensesOverTimeChart from '@/components/dashboard/dashlets/ExpensesOverTimeChart.vue'
  import { DashletOptions, DashboardContext } from '@/types/dashboard'

  export default defineComponent({
    name: 'Dashboard',
    components: {
      PageHeader,
      CategoryExpensesChart,
      ExpensesOverTimeChart,
    },
    setup() {
      const rootEl = ref<HTMLElement | null>(null)
      const hideLayout = ref(false)

      const dashboardLayout: DashletOptions[] = [
        {
          id: '0',
          component: 'CategoryExpensesChart',
          dashletTitle: 'Expenses By Category',
        },
        {
          id: '1',
          component: 'ExpensesOverTimeChart',
          dashletTitle: 'Expenses Over Time',
        },
      ]

      // Maximize the specified dashlet, making it full screen size
      function maximizeDashlet(dashletOptions: DashletOptions) {
        hideLayout.value = true

        // Set the'hide' class on all dashlet items except for the one that is maximized
        const allGridItems = rootEl.value?.querySelectorAll('.dashlet-container') || []
        const elList: Element[] = Array.from(allGridItems)
        elList.forEach((el: Element) => {
          el.classList.add('hidden')
        })

        const maximizeGridItem: Element | null | undefined = rootEl.value?.querySelector(
          `.dashlet-container[id="${dashletOptions.id}"]`
        )

        maximizeGridItem?.classList.remove('hidden')
        maximizeGridItem?.classList.add('maximize')

        triggerWindowResize()
      }

      // Minimize the dashlets
      function minimizeDashlet() {
        hideLayout.value = false

        const allGridItems = rootEl.value?.querySelectorAll('.dashlet-container') || []
        const elList = Array.from(allGridItems)
        elList.forEach((el: Element) => {
          el.classList.remove('hidden')
          el.classList.remove('maximize')
        })

        triggerWindowResize()
      }

      // Trigger a window resize event.  This is used to fix chart rendering issues.
      function triggerWindowResize() {
        type ExtDocument = Document & { documentMode: number }

        nextTick(() => {
          const documentMode = (document as ExtDocument)?.documentMode
          if (documentMode && documentMode <= 11) {
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

      // Provide the dashboard context to the Dashlet component
      provide('dashboardContext', {
        maximizeDashlet: maximizeDashlet,
        minimizeDashlet: minimizeDashlet,
      } as DashboardContext)

      return {
        dashboardLayout,
        maximizeDashlet,
        minimizeDashlet,
        hideLayout,
        rootEl,
      }
    },
  })
</script>

<style lang="scss" scoped>
  .dashlet-container.maximize {
    position: absolute;
    top: 60px;
    left: 24px;
    right: 24px;
    bottom: 24px;
    width: calc(100vw - 48px);
    padding-right: 0px !important;

    :deep(.dashlet-content) {
      height: calc(100vh - 200px) !important;
    }
  }

  .dashlet-container:nth-child(odd) {
    padding-right: 24px;
  }

  @media (max-width: $breakpoint-xs-max) {
    .dashboard {
      padding-top: 8px !important;
    }
  }

  @media (max-width: $breakpoint-sm-max) {
    .dashlet-container {
      margin-bottom: 16px;
      padding-right: 0px !important;
    }
    .dashlet-container:last-child {
      margin-bottom: 0px;
    }
  }
</style>
