<template>
  <div>
    <q-layout view="hHh Lpr lff" container class="window-height shadow-2">
      <AppBar />

      <q-page-container>
        <q-page
          class="q-py-xs-sm q-py-sm-lg q-px-xs-sm q-px-sm-md q-px-md-lg q-px-lg-xl q-px-xl-xl"
        >
          <router-view :key="$route.fullPath" />
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script setup lang="ts">
  import AppBar from './components/common/AppBar.vue'
</script>

<style lang="scss">
  // Position the loading bar below the app header
  .q-loading-bar--top {
    top: 65px !important;
  }

  // Quasar dialog plugin styling
  .q-dialog-plugin .q-dialog__title {
    padding: 8px;
    margin-bottom: 24px;
    background-color: $primary;
    color: #ffffff;
  }

  @media (max-width: $breakpoint-xs-max) {
    .q-loading-bar--top {
      top: 49px !important;
    }
  }
</style>
