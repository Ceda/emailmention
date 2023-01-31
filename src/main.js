import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import contenteditable from 'vue-contenteditable'
Vue.use(contenteditable)

new Vue({
  render: h => h(App),
}).$mount('#app')
