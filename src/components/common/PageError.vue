<template>
  <div v-if="error" class="page-error q-pb-sm text-negative">{{ error }}</div>
</template>

<script setup lang="ts">
  defineProps<{
    error?: string | null
  }>()
</script>
