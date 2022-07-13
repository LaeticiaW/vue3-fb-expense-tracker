<template>
  <span>
    <q-select
      v-model="selectedValues"
      outlined
      multiple
      dense
      :options="items"
      :label="label"
      :option-label="itemText"
      :option-value="itemValue"
      style="width: 208px"
      :bg-color="bgColor"
      @update:modelValue="onChange"
    >
      <template #selected-item="{ index, opt }">
        <span v-if="index === 0">{{ opt.label }}</span>
        <span v-if="index === 1" class="q-pl-xs"> (+{{ selectedValues.length - 1 }}) </span>
      </template>
    </q-select>
  </span>
</template>

<script setup lang="ts">
  import { ref, Ref } from 'vue'
  import { SelectCategory } from '@/types/category'

  withDefaults(
    defineProps<{
      modelValue: Ref<string[]>
      label: string
      items: SelectCategory[]
      itemText?: string
      itemValue?: string
      bgColor?: string
    }>(),
    {
      itemText: 'label',
      itemValue: 'value',
      bgColor: 'white',
    }
  )

  const emit = defineEmits(['update:modelValue'])

  const selectedValues = ref<string[]>([])

  const onChange = (value: SelectCategory[]) => {
    emit(
      'update:modelValue',
      value.map((item) => item.value)
    )
  }
</script>
