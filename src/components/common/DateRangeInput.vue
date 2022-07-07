<template>
  <!-- Common Date Range input -->
  <div class="date-range-container">
    <!-- Start Date -->
    <div class="date-wrapper">
      <q-input
        v-model="start"
        outlined
        dense
        no-error-icon
        readonly
        label="Start Date"
        mask="####-##-##"
        :bg-color="bgColor"
      >
        <q-menu ref="startDateMenuRef">
          <q-date
            v-model="start"
            minimal
            no-unset
            :mask="dateFormat"
            :options="validateStartDate"
            @update:modelValue="startDateMenuRef!.hide()"
          />
        </q-menu>
      </q-input>
    </div>

    <!-- End Date -->
    <div class="date-wrapper">
      <q-input
        v-model="end"
        outlined
        dense
        no-error-icon
        readonly
        label="End Date"
        mask="####-##-##"
        :bg-color="bgColor"
      >
        <q-menu ref="endDateMenuRef">
          <q-date
            v-model="end"
            minimal
            no-unset
            :mask="dateFormat"
            :navigation-min-year-month="minDate"
            :navigation-max-year-month="maxDate"
            :options="validateEndDate"
            @update:modelValue="endDateMenuRef!.hide()"
          >
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close" color="primary" flat />
            </div>
          </q-date>
        </q-menu>
      </q-input>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, Ref } from 'vue'
  import dayjs from 'dayjs'
  import 'vue-datepicker-next/index.css'
  import { QMenu } from 'quasar'

  // Props
  const props = withDefaults(
    defineProps<{
      startDate: Ref<string>
      endDate: Ref<string>
      bgColor?: string
      minDate?: string
      maxDate?: string
    }>(),
    {
      bgColor: 'white',
      minDate: `${new Date().getFullYear()}/01`,
      maxDate: `${new Date().getFullYear()}/${('0' + (new Date().getMonth() + 1)).slice(-2)}`,
    }
  )

  // Emits
  defineEmits(['update', 'update:startDate', 'update:endDate'])

  // Initialize start and end dates
  const start = ref(props.startDate || dayjs().startOf('year').format('YYYY-MM-DD'))
  const end = ref(props.endDate || dayjs().format('YYYY-MM-DD'))
  const dateFormat = ref('YYYY-MM-DD')
  const startDateMenuRef = ref<QMenu | null>(null)
  const endDateMenuRef = ref<QMenu | null>(null)

  // Validate start date
  const validateStartDate = (dt: string) => {
    const calendarDt = new Date(dt).getTime()
    const endDt = new Date(end.value).getTime()
    const today = new Date().getTime()
    return calendarDt <= today && calendarDt <= endDt
  }

  // Validate end date
  const validateEndDate = (dt: string) => {
    const calendarDt = new Date(dt).getTime()
    const startDt = new Date(start.value).getTime()
    const today = new Date().getTime()
    return calendarDt <= today && calendarDt >= startDt
  }
</script>

<style lang="scss" scoped>
  .date-wrapper {
    display: inline-flex;
    margin-right: 8px !important;
    width: 100px;
  }

  :deep(.q-field--outlined.q-field--readonly .q-field__control:before) {
    border-style: solid !important;
  }
</style>
