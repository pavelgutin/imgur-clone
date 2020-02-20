import Vue from 'vue'
import App from './App.vue'
// we import the vue router from our router/index.js file
import router from './router'

Vue.config.productionTip = false

new Vue({
  router, // we tell our vue instance to use this vue router
  render: h => h(App),
}).$mount('#app')