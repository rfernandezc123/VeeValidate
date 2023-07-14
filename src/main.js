import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import Vuelidate from 'vuelidate'
import axios from 'axios'
import VueSweetalert2 from 'vue-sweetalert2';
import VueTheMask from 'vue-the-mask'
import money from 'v-money';
import {ValidationObserver, ValidationProvider } from 'vee-validate';
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import 'sweetalert2/dist/sweetalert2.min.css';


Vue.config.productionTip = false;
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(axios)
Vue.use(Vuelidate)
Vue.use(VueSweetalert2);
Vue.use(VueTheMask)
Vue.use(money, {precision: 4})
Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);


new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
