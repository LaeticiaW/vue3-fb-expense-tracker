import { computed, ComputedRef } from 'vue'
import { QueryResponse } from '@/types/query'
import useCategories from '@/hooks/data/useCategories'
import { SelectCategory } from '@/types/category'

/*
 * Retrieves the categories formatted for a select dropdown
 */
export default function (): ComputedRef<QueryResponse<SelectCategory[]>> {
  const categories = useCategories({ runQuery: true })

  const selectCategories = computed((): SelectCategory[] => {
    return categories.value.data?.map((item) => ({
      value: item.id,
      label: item.name,
    }))
  })

  return computed(() => {
    return {
      ...categories.value,
      data: selectCategories.value,
    } as QueryResponse<SelectCategory[]>
  })
}
