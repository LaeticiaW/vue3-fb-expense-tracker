<template>
  <!-- Common page header -->
  <h2 class="page-title q-mt-none q-pb-xs">{{ title }}</h2>
</template>

<script>
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'PageHeader',

    props: {
      title: {
        type: String,
        required: true,
      },
    },
  })
</script>

<style lang="scss" scoped>
  .page-title {
    font-size: 1.25rem;
    line-height: 1.25rem;
    font-weight: bold;
  }
</style>
