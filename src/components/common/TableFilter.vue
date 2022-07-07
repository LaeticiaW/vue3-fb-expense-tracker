<template>
  <!-- Common filter bar containing slots for inputs and actions -->
  <q-toolbar class="filter bg-secondary rounded-borders q-mb-lg q-py-sm">
    <slot name="inputs" />
    <q-space />
    <slot name="actions" />
  </q-toolbar>
</template>
