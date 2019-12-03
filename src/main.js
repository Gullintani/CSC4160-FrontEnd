import Vue from 'vue'
import App from './App.vue'
// import 'bootstrap/dist/css/bootstrap.min.css'
// import 'bootstrap/dist/js/bootstrap.min'
// replaced bootstrap with CDN
import axios from 'axios'
import VueAxios from 'vue-axios'
import echarts from "echarts";
// replaced echart with CDN
import "echarts-gl";
Vue.use(VueAxios, axios)
Vue.prototype.$echarts = echarts;

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
