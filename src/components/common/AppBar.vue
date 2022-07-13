<template>
  <div>
    <!-- App Bar -->
    <q-header class="secondary q-pa-sm">
      <q-toolbar>
        <q-btn v-if="isLoggedIn" flat round dense icon="mdi-menu" @click="navItemClicked" />
        <q-toolbar-title>Expense Tracker</q-toolbar-title>
        <q-space />

        <q-btn v-if="isLoggedIn" round>
          <q-avatar v-ripple:primary color="white" text-color="primary">{{
            avatarLetter
          }}</q-avatar>
          <q-menu auto-close bottom left>
            <q-list dense>
              <q-item clickable @click="logout">
                <q-item-section>Logout</q-item-section>
              </q-item>
              <q-item v-if="loggedInUserId === 'admin'" clickable @click="reloadData">
                <q-item-section>Reload Demo Data</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <!-- Navigation Drawer -->
    <q-drawer
      v-model="navDrawerOpen"
      :width="250"
      :breakpoint="500"
      overlay
      bordered
      class="shadow-3"
    >
      <q-scroll-area class="fit">
        <q-list class="q-pa-sm">
          <template v-for="item in navRoutes" :key="item.name">
            <q-item
              q-ripple
              clickable
              :active="item.name === 'Outbox'"
              :to="{ name: item.name }"
              class="text-weight-medium rounded-borders"
            >
              <q-item-section avatar>
                <q-icon :name="item.meta.icon" />
              </q-item-section>
              <q-item-section>
                {{ item.name }}
              </q-item-section>
            </q-item>
          </template>
        </q-list>
      </q-scroll-area>
    </q-drawer>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { Routes } from '@/router'
  import { useUserStore } from '@/store/user'
  import { useRouter } from 'vue-router'
  import { useDialog } from '@/hooks/useDialog'
  import { useNotify } from '@/hooks/useNotify'
  import ReloadService from '@/services/reload'

  // Allow parent to close the nav drawer
  defineExpose({ closeNavDrawer })

  const navDrawerOpen = ref<boolean>(false)

  const userStore = useUserStore()
  const router = useRouter()
  const { showDialog } = useDialog()
  const { showNotify } = useNotify()

  const navRoutes = computed(() => {
    // only return routes that should show up in the navigation drawer
    return Routes.filter((route) => !route.meta.hidden)
  })

  const avatarLetter = computed(() => {
    if (userStore.loggedInUserId && userStore.currentUser && userStore.currentUser.userId) {
      return userStore.currentUser.userId.substring(0, 1).toUpperCase()
    }
    return ''
  })

  const isLoggedIn = computed(() => {
    return userStore.loggedInUserId !== null
  })

  const loggedInUserId = computed(() => {
    return userStore.loggedInUserId
  })

  // Toggle the nav drawer
  function navItemClicked() {
    navDrawerOpen.value = !navDrawerOpen.value
  }

  // Close the navigation drawer
  function closeNavDrawer() {
    console.log('In AppBar closeNavDrawer, setting to false')
    navDrawerOpen.value = false
  }

  // Logout user
  function logout() {
    userStore.logout()
    router.push({ name: 'Login' })
  }

  //Reload the demo category and expense data into Firebase
  async function reloadData() {
    showDialog({
      title: 'Confirm Reload Data',
      message: `Are you sure you want to reload the category and expense data?`,
    }).onOk(async () => {
      try {
        await ReloadService.reloadCategoryData()
        await ReloadService.reloadExpenseData()
      } catch (e) {
        console.error('Error reloading category and expense demo data:', e)
        showNotify({ message: 'Error reloading demo data' })
      }
    })
  }
</script>

<style lang="scss" scoped>
  @media (max-width: $breakpoint-xs-max) {
    .q-header {
      padding: 0px !important;
    }
  }
</style>
