<template>
  <div>
    <!-- App Bar -->
    <q-header elevated class="secondary q-pa-sm">
      <q-toolbar>
        <q-btn flat round dense icon="mdi-menu" @click="navItemClicked" />
        <q-toolbar-title>Expense Tracker</q-toolbar-title>
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
              v-ripple
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

<script>
  import { defineComponent } from 'vue'
  import { Routes } from '@/router'

  export default defineComponent({
    name: 'AppBar',

    data() {
      return {
        navDrawerOpen: null,
      }
    },

    computed: {
      navRoutes() {
        // only return routes that should show up in the navigation drawer
        return Routes.filter((route) => !route.meta.hidden)
      },
      avatarLetter() {
        // if (
        //   this.$store.state.loggedInUserId &&
        //   this.$store.state.currentUser &&
        //   this.$store.state.currentUser.userId
        // ) {
        //   return this.$store.state.currentUser.userId.substr(0, 1).toUpperCase()
        // }
        return ''
      },
      isLoggedIn() {
        // return this.$store.state.loggedInUserId !== null
        return true
      },
      loggedInUserId() {
        // return this.$store.state.loggedInUserId
        return 'admin1'
      },
    },

    methods: {
      /*
       * Toggle the nav drawer
       */
      navItemClicked() {
        this.navDrawerOpen = !this.navDrawerOpen
      },

      /*
       * Logout user
       */
      logout() {
        // this.$store.dispatch('logout')
        // this.$router.push({ name: 'Login' })
      },
    },
  })
</script>

<style lang="scss" scoped>
  .v-navigation-drawer--temporary.v-navigation-drawer--clipped {
    z-index: 5;
    padding-top: 64px;
  }
  .v-list-item__title {
    font-size: 0.875em !important;
  }
  :deep(.v-app-bar-nav-icon) {
    margin-left: -8px;
  }
</style>
