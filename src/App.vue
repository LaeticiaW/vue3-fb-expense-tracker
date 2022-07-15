<template>
  <div>
    <q-layout view="hHh Lpr lff" container class="window-height shadow-2">
      <AppBar ref="appBarRef" />

      <q-page-container @click="closeNavDrawer">
        <q-page class="q-py-xs-sm q-py-sm-md q-px-xs-sm q-px-sm-md">
          <router-view :key="$route.fullPath" />
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import AppBar from './components/common/AppBar.vue'

  const appBarRef = ref<InstanceType<typeof AppBar> | null>(null)

  function closeNavDrawer() {
    appBarRef.value?.closeNavDrawer()
  }
</script>

<style lang="scss">
  // Position the loading bar below the app header
  .q-loading-bar--top {
    top: 58px !important;
  }

  @media (max-width: $breakpoint-xs-max) {
    .q-loading-bar--top {
      top: 50px !important;
    }
  }

  // Quasar dialog plugin styling
  .q-dialog-plugin .q-dialog__title {
    padding: 8px;
    margin-bottom: 24px;
    background-color: $primary;
    color: #ffffff;
  }
</style>
