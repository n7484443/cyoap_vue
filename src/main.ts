import {createApp} from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import './cyoap_core';
import {loadFonts} from './plugins/webfontloader'
import {createStore} from "vuex";
import common from "./fn_common";

loadFonts();

type stateType = {
    platformDesign: Object,
    nodePresets: Object,
    linePresets: Object,
    isSmallDisplay: boolean,
}

const store = createStore({
    state() :stateType {
        return {
            platformDesign: {},
            nodePresets: {},
            linePresets: {},
            isSmallDisplay: false,
        }
    },
    mutations: {
        setPlatformDesign(state, platformDesign: Object) {
            state.platformDesign = platformDesign;
        },
        setNodePresets(state, presetList: [Object]) {
            presetList.forEach(function (e) {
                // @ts-ignore
                state.nodePresets[e.name] = e;
            })
        },
        setLinePresets(state, presetList: Map<any, any>) {
            presetList.forEach(function (e) {
                // @ts-ignore
                state.linePresets[e.name] = e;
            })
        },
        setSmallDisplay(state, size: number) {
            state.isSmallDisplay = size < 1000;
        }
    },
    getters: {
        getPlatformDesign(state): Object {
            return state.platformDesign;
        },
        getNodePresets(state): Object {
            return state.nodePresets;
        },
        getLinePresets(state): Object {
            return state.linePresets;
        },
        getCurrentMaxWidth(state): number {
            return state.isSmallDisplay ? 6 : 12;
        },
    }
})

const app = createApp(App);
app.use(vuetify);
app.use(common);
app.use(store);
app.mount('#app');
