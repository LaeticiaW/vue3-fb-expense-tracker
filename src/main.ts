import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import './firebase/firebase'
import HighchartsVue from 'highcharts-vue'
import Highcharts from 'highcharts'
import annotations from 'highcharts/modules/annotations'
import drilldown from 'highcharts/modules/drilldown'
import { Quasar, Notify, LoadingBar, Dialog } from 'quasar'

// Import Quasar icon libraries
import '@quasar/extras/roboto-font/roboto-font.css'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/flex-addon.sass'

// Import Quasar css
import 'quasar/src/css/index.sass'

loadFonts()

const app = createApp(App)

app.use(router)
// app.use(vuetify)

// Initialize Highcharts
app.use(HighchartsVue as any)
annotations(Highcharts)
drilldown(Highcharts)

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
  /*
  config: {
    brand: {
      // primary: '#e46262',
      // ... or all other brand colors
    },
    notify: {...}, // default set of options for Notify Quasar plugin
    loading: {...}, // default set of options for Loading Quasar plugin
    loadingBar: { ... }, // settings for LoadingBar Quasar plugin
    // ..and many more (check Installation card on each Quasar component/directive/plugin)
  }
  */
})

// Force user to Login, if needed.
// Note that this is not secure with real authorization, it just fakes a user login
// and stores the userId in localStorage.  The currentUser is stored in Vuex.
// router.beforeEach(async (to, from, next) => {
//   // console.log('Router beforeEach, to:', to, 'from:', from)
//   if (to.name === 'Login') {
//     next()
//   } else if (!store.state.loggedInUserId) {
//     next({ name: 'Login' })
//   } else if (!store.state.currentUser) {
//     try {
//       const user = await UserService.getUser(store.state.loggedInUserId)
//       store.commit('setCurrentUser', user)
//       next()
//     } catch (error) {
//       console.error('Error retrieving user', store.state.loggedInUserId, error)
//       next()
//     }
//   } else {
//     next()
//   }
// })

app.mount('#app')
