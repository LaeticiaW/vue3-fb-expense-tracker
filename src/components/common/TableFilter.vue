<template>
  <!-- Common filter bar containing slots for inputs and actions -->
  <q-toolbar class="filter bg-secondary rounded-borders q-mb-lg q-py-sm">
    <slot name="inputs" />
    <q-space />
    <slot name="actions" />
  </q-toolbar>
</template>

<style lang="scss" scoped>
  @media (max-width: $breakpoint-xs-max) {
    .filter {
      margin-bottom: 12px;
    }
  }
</style>
