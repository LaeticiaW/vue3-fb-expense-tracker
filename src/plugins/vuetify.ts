// Styles
import '@mdi/font/css/materialdesignicons.css'
// import 'vuetify/lib/styles/main.css'
// import 'vuetify/lib/styles/main.sass'
import 'vuetify/dist/vuetify.css'
// import 'vuetify/lib/styles/main.css'

// Vuetify
import { createVuetify } from 'vuetify'

// const lightTheme: ThemeDefinition = {
//   dark: false,
//   colors: {
//     background: '#FFFFFF',
//     surface: '#FFFFFF',
//     primary: '#005da1',
//     'primary-darken-1': '#3700B3',
//     secondary: '#d8ebf7',
//     'secondary-darken-1': '#018786',
//     error: '#bf0d3e',
//     info: '#2196F3',
//     success: '#4CAF50',
//     warning: '#ffb81c',
//     accent: '#e57200',
//     'icon-background': '#005da1',
//   },
// }

export default createVuetify({
  icons: {
    //iconfont: 'mdi', // default - only for display purposes
  },
  theme: {
    // defaultTheme: 'lightTheme',
    // themes: {
    //   lightTheme,
    // },
    themes: {
      light: {
        dark: false,
        colors: {
          background: '#FFFFFF',
          surface: '#FFFFFF',
          primary: '#005da1',
          'primary-darken-1': '#3700B3',
          secondary: '#d8ebf7',
          'secondary-darken-1': '#018786',
          error: '#bf0d3e',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#ffb81c',
          accent: '#e57200',
          'icon-background': '#005da1',
        },
      },
    },
  },
})
