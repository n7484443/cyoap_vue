import {createApp} from 'vue'
// @ts-ignore
import App from './App.vue'
import vuetify from './plugins/vuetify'
import './cyoap_core';
import common from "./fn_common";
import {createPinia} from "pinia";

const app = createApp(App);
app.use(vuetify);
app.use(common);
const pinia = createPinia();
app.use(pinia);
app.mount('#app');
