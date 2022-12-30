import {createApp} from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import './cyoap_core';
import {loadFonts} from './plugins/webfontloader'
import {createStore} from "vuex";

loadFonts();

const store = createStore({
    state() {
        return {
            platformDesign: {},
            nodePresets: {},
            linePresets: {},
        }
    },
    mutations: {
        setPlatformDesign(state, platformDesign) {
            state.platformDesign = platformDesign;
        },
        setNodePresets(state, presetList) {
            presetList.forEach(function (e) {
                state.nodePresets[e['name']] = e;
            })
        },
        setLinePresets(state, presetList) {
            presetList.forEach(function (e) {
                state.linePresets[e['name']] = e;
            })
        }
    },
    getters: {
        getPlatformDesign(state) {
            return state.platformDesign;
        },
        getNodePresets(state) {
            return state.nodePresets;
        },
        getLinePresets(state) {
            return state.linePresets;
        },
    }
})

let app = createApp(App);
app.use(vuetify);
app.use(store);
app.mount('#app');
