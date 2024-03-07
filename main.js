import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
import store from './store/store.js'
import uView from './uni_modules/uview-ui'
Vue.config.productionTip = false
App.mpType = 'app'
Vue.use(uView)
uni.$u.config.unit = 'rpx'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app,
	store
  }
}
// #endif