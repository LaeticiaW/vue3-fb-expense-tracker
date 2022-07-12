import { createApp, Plugin } from 'vue'
import { createPinia } from 'pinia'
import App from '@/App.vue'
import router from '@/router'
import { loadFonts } from '@/plugins/webfontloader'
import '@/firebase/firebase'
import HighchartsVue from 'highcharts-vue'
import Highcharts from 'highcharts'
import annotations from 'highcharts/modules/annotations'
import drilldown from 'highcharts/modules/drilldown'
import { Quasar, Notify, LoadingBar, Dialog } from 'quasar'
import { useUserStore } from '@/store/user'
import UserService from '@/services/user'

// Quasar icon libraries and css
import '@quasar/extras/roboto-font/roboto-font.css'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/flex-addon.sass'
import 'quasar/src/css/index.sass'

loadFonts()

const app = createApp(App)

app.use(router)

// Iinitialize pinia
const pinia = createPinia()
app.use(pinia)
const userStore = useUserStore()

// Initialize Highcharts
app.use(HighchartsVue as any)
annotations(Highcharts)
drilldown(Highcharts)

// Initialize Quasar
app.use(Quasar, {
  plugins: { Notify, LoadingBar, Dialog },
  config: {
    notify: {
      position: 'bottom',
      timeout: 4000,
      textColor: 'white',
      actions: [{ icon: 'close', color: 'white' }],
      multiLine: false,
      message: '',
      caption: undefined,
      color: 'negative',
    },
    loadingBar: {
      skipHijack: false,
      color: 'purple',
      size: '4px',
      position: 'top',
      animationSpeed: 100,
    },
  },
})

// Global error handler, just log error
app.config.errorHandler = (err, instance, info) => {
  console.error('Global error handler:', err, instance, info)
}

// Force user to Login, if needed.
// Note that this is not secure with real authorization, it just fakes a user login
// and stores the userId in localStorage.  The currentUser is stored in Pinia.
router.beforeEach(async (to, from, next) => {
  if (to.name === 'Login') {
    next()
  } else if (!userStore.loggedInUserId) {
    next({ name: 'Login' })
  } else if (!userStore.currentUser) {
    try {
      const user = await UserService.getUser(userStore.loggedInUserId)
      userStore.setCurrentUser(user)
      next()
    } catch (error) {
      console.error('Error retrieving user', userStore.loggedInUserId, error)
      next()
    }
  } else {
    next()
  }
})

app.mount('#app')
