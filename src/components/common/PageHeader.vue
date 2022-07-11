<template>
  <h2 class="page-title q-mt-none q-pb-xs">{{ title }}</h2>
</template>

<script setup lang="ts">
  defineProps<{
    title: string
  }>()
</script>

<style lang="scss" scoped>
  .page-title {
    font-size: 1.25rem;
    line-height: 1.25rem;
    font-weight: bold;
  }

  @media (max-width: $breakpoint-xs-max) {
    .page-title {
      margin-bottom: 8px;
    }
  }
</style>
