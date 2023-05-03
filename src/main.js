import Vue from 'vue'
import App from './App.vue'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false

import contenteditable from 'vue-contenteditable'

Vue.use(contenteditable)
Vue.use(ElementUI);

new Vue({
  render: h => h(App),
}).$mount('#app')
