import {createApp} from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import './cyoap_core';
import {loadFonts} from './plugins/webfontloader'
import common from "./fn_common";
import {createPinia} from "pinia";

loadFonts();

const app = createApp(App);
app.use(vuetify);
app.use(common);
const pinia = createPinia();
app.use(pinia);
app.mount('#app');
