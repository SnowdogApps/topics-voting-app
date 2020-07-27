// import './db'
import Vue from 'vue'
import App from './App.vue'
import store from './store'

import './registerServiceWorker'
import router from './router'
import VueIziToast from 'vue-izitoast'
import VueSocialSharing from 'vue-social-sharing'
import i18n from './i18n'
import focusVisible from 'focus-visible'
const rtdbPlugin = ({ rtdbPlugin }) => import('vuefire')

const options = {
  position: 'topRight',
  timeout: 12000
}

Vue.use(rtdbPlugin)
Vue.use(VueIziToast, options)
Vue.use(VueSocialSharing)

new Vue({
  store,
  router,
  i18n,
  focusVisible,
  render: h => h(App)
}).$mount('#app')
