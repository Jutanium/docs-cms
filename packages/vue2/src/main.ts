import Vue from 'vue'
import App from './TestApp.vue'
import Renderer from "@/components/Renderer";

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
