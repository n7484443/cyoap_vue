import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import './cyoap_core';
import { loadFonts } from './plugins/webfontloader'
import {createStore} from "vuex";

loadFonts()

const store = createStore({
    state() {
        return {
            platformDesign: {}
        }
    },
    mutations: {
        setPlatformDesign(state, platformDesign){
            state.platformDesign = platformDesign;
        }
    },
    getters: {
        getPlatformDesign(state){
            return state.platformDesign;
        },
    }
})

let app = createApp(App);
app.use(vuetify);
app.use(store);
app.mount('#app');
