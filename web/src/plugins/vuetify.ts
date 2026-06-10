import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'sapLight',
    themes: {
      sapLight: {
        dark: false,
        colors: {
          primary: '#0070F2',
          secondary: '#354A5E',
          success: '#107E3E',
          error: '#BB0000',
          warning: '#E9730C',
          info: '#0854A0',
          background: '#F5F5F5',
          surface: '#FFFFFF'
        }
      }
    }
  },
  defaults: {
    VBtn: {
      style: 'font-family: "72", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;'
    }
  }
})
