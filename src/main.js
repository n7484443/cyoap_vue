import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import './cyoap_core';
import { loadFonts } from './plugins/webfontloader'
import {createStore} from "vuex";

loadFonts();

const store = createStore({
    state() {
        return {
            platformDesign: {},
            presets: {},
        }
    },
    mutations: {
        setPlatformDesign(state, platformDesign){
            state.platformDesign = platformDesign;
        },
        setPresets(state, presetList){
            presetList.forEach(function(e){
                state.presets[e['name']] = e;
            })
        }
    },
    getters: {
        getPlatformDesign(state){
            return state.platformDesign;
        },
        getPresets(state){
            return state.presets;
        }
    }
})

let app = createApp(App);
app.use(vuetify);
app.use(store);
app.mount('#app');
