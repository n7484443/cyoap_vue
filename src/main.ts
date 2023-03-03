import {createApp} from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import './cyoap_core';
import {loadFonts} from './plugins/webfontloader'
import {createStore} from "vuex";
import common from "./fn_common";

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
            // @ts-ignore
            state.platformDesign = platformDesign;
        },
        setNodePresets(state, presetList) {
            // @ts-ignore
            presetList.forEach(function (e) {
                // @ts-ignore
                state.nodePresets[e['name']] = e;
            })
        },
        setLinePresets(state, presetList) {
            // @ts-ignore
            presetList.forEach(function (e) {
                // @ts-ignore
                state.linePresets[e['name']] = e;
            })
        }
    },
    getters: {
        getPlatformDesign(state) {
            // @ts-ignore
            return state.platformDesign;
        },
        getNodePresets(state) {
            // @ts-ignore
            return state.nodePresets;
        },
        getLinePresets(state) {
            // @ts-ignore
            return state.linePresets;
        },
    }
})

const app = createApp(App);
app.use(vuetify);
app.use(common);
app.use(store);
app.mount('#app');
