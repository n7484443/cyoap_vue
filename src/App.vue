<template>
    <div v-if="isLoading !== -1" class="spinner-container">
        <v-progress-circular size="72" width="8" :model-value="isLoading / isLoadingMax * 100"
                             color="red"></v-progress-circular>
    </div>
    <v-app v-else class="default-font-size default-padding" :full-height="true">
        <div class="background-color">
            <div class="background">
                <error-log></error-log>
                <h5 class="version-right">
                    {{ version }}
                </h5>
                <main>
                    <div v-for="(n, i) in child" :key="n">
                        <LineSetting ref="lineSetting" :pos="i" @needUpdate="needUpdate">
                        </LineSetting>
                    </div>
                </main>
            </div>
            <div class="bottom-variable">
                <HorizontalScroll ref="horizontalScroll">
                </HorizontalScroll>
            </div>
            <div class="top-toolbar">
                <div class="result">
                    <div class="button">
                        <v-btn color="primary" variant="text" icon="mdi-content-save" width="36" height="36"
                               v-on:click="saveCurrentStatus"/>
                        <v-btn color="primary" variant="text" icon="mdi-upload" width="36" height="36"
                               v-on:click="loadCurrentStatus"/>
                    </div>
                    <v-dialog v-model="dialog" scrollable>
                        <template v-slot:activator="{ props }">
                            <v-btn color="primary" class="mx-3" v-bind="props">
                                {{ summary }}
                            </v-btn>
                        </template>
                        <v-card>
                            <v-card-text>
                                <SelectedResult id="capture" ref="selectedResult"></SelectedResult>
                            </v-card-text>
                            <v-card-actions>
                                <v-btn color="primary" @click="saveAsImage">{{ save_as_image }}</v-btn>
                                <v-btn color="primary" @click="changeResultSize">{{ change_result_size }}</v-btn>
                                <v-btn color="primary" @click="dialog = false">{{ close }}</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </div>
            </div>
        </div>
    </v-app>
</template>

<script>
import LineSetting from './components/LineSetting.vue';
import HorizontalScroll from "./components/HorizontalScroll.vue";
import WebFont from "webfontloader/webfontloader";
import SelectedResult from "./components/SelectedResult.vue";
import domtoimage from "dom-to-image-more";
import {useStore} from "@/fn_common";
import ErrorLog from "@/components/ErrorLog.vue";

export default {
    name: 'App',

    components: {
        ErrorLog,
        LineSetting,
        HorizontalScroll,
        SelectedResult
    },

    async created() {
        const store = useStore();
        const url = "dist/";
        let platform = await fetch(url + "platform.json?time=" + new Date().getTime());
        platform = await platform.text();
        let lineData = await fetch(url + "nodes/list.json?time=" + new Date().getTime());
        lineData = await lineData.json();
        let lineSetting = [];

        this.isLoadingMax = lineData.length;

        for (let i = 0; i < lineData.length; i++) {
            let innerLine = fetch(url + "nodes/" + lineData[i] + "?time=" + new Date().getTime()).then(res => res.text());
            innerLine.then(() => this.isLoading += 1);
            lineSetting.push(innerLine);
        }
        let output = await Promise.all(lineSetting);
        this.child = output.length;
        window.loadPlatform(platform, output);

        let textFontList = {
            "jua": "Jua",
            "notoSans": "Noto Sans KR",
            "notoSerif": "Noto Serif KR",
            "나눔고딕": "Nanum Gothic",
            "나눔손글씨 붓": "Nanum Brush Script",
            "나눔손글씨 펜": "Nanum Pen Script",
            "Poor Story": "Poor Story",
            "East Sea Dokdo": "East Sea Dokdo",
            "Black Han Sans": "Black Han Sans",
            "Black And White Picture": "Black And White Picture",
            "Neo 둥근모": 'NeoDunggeunmo',
            "IBM Plex Sans KR": "IBM Plex Sans KR"
        };
        let design = JSON.parse(window.getPlatformDesign());
        store.setPlatformDesign(design);
        let nodePresetList = JSON.parse(window.getNodePresetList());
        let linePresetList = JSON.parse(window.getLinePresetList());
        let fontHashSet = new Set();
        nodePresetList.forEach(function (e) {
            fontHashSet.add(e['titleFont']);
            fontHashSet.add(e['mainFont']);
        });
        store.setNodePresets(nodePresetList);
        store.setLinePresets(linePresetList);
        this.variableFont = textFontList[design['variableFont']];
        WebFont.load({
            google: {
                families: [...fontHashSet, this.variableFont]
            }
        });

        if (design.backgroundImage) {
            this.imageBackground = "url(/dist/images/" + design.backgroundImage.replaceAll(" ", "%20") + ")";
        }
        if (design.backgroundColor) {
            this.backgroundColor = this.$getColor(design.backgroundColor, 0xFFFFFFFF);
        }
        switch (design['backgroundAttribute']) {
            case "fit":
                this.backgroundSize = "contain";
                break;
            case "fill":
                this.backgroundSize = "cover";
                break;
            case "pattern":
                this.backgroundRepeat = "repeat";
                break;
            case "stretch":
                this.backgroundSize = "100% 100%";
                break;
        }
        this.marginVertical = design.marginVertical + 'px';
        this.isLoading = -1;

        store.setErrorLog(window.getErrorLog());
    },

    data() {
        const store = useStore();
        store.setSmallDisplay(window.innerWidth);
        window.addEventListener('resize', () => {
            let before = store.getCurrentMaxWidth;
            store.setSmallDisplay(window.innerWidth);
            let after = store.getCurrentMaxWidth;
            if (before !== after) {
                this.needUpdate();
            }
        });
        return {
            isLoading: 0,
            isLoadingMax: 100,
            modelValue: "",
            child: 0,
            variableFont: "",
            imageBackground: "",
            backgroundRepeat: "no-repeat",
            backgroundSize: "auto",
            backgroundColor: "",
            dialog: false,
            marginVertical: '8px',
            summary: this.$getTranslation('summary'),
            save_as_image: this.$getTranslation('save_as_image'),
            change_result_size: this.$getTranslation('change_result_size'),
            close: this.$getTranslation('close'),
            addedEventListener: false,
            version: 'flutter_vue version : ' + APP_VERSION
        }
    },
    methods: {
        updateChild() {
            this.$refs.horizontalScroll.updateList();
            this.$refs.lineSetting.forEach(i => i.updateChild());
            useStore().setErrorLog(window.getErrorLog());
        },
        needUpdate() {
            this.updateChild();
        },
        async saveAsImage() {
            let element = document.querySelector("#capture");
            let blob = await domtoimage.toBlob(element,);
            //blob download as result.png
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = "result.png";
            link.click();
        },
        saveCurrentStatus() {
            let data = window.getSelectedPos();
            let blob = new Blob([data], {type: "text/plain;charset=utf-8"});
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = "save.json";
            link.click();
        },
        loadCurrentStatus() {
            //json file select and upload
            let input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = (e) => {
                let file = e.target.files[0];
                let reader = new FileReader();
                reader.onload = (e) => {
                    let data = e.target.result;
                    window.setSelectedPos(data);
                    this.needUpdate();
                };
                reader.readAsText(file);
            };
            input.click();
        },
        changeResultSize(){
            this.$refs.selectedResult.changeResultSize();
        }
    }
}
</script>
<style>

*::-webkit-scrollbar {
    -webkit-appearance: none;
}

*::-webkit-scrollbar:vertical {
    width: 10px;
}

*::-webkit-scrollbar:horizontal {
    height: 16px;
}

*::-webkit-scrollbar-thumb {
    background-color: #2f3542;
    border-radius: 10px;
}

*::-webkit-scrollbar-track {
    background-color: grey;
}

.spinner-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 240px;
}

.variable_font {
    font-family: v-bind(variableFont);
    font-size: 1rem;
}

.background {
    padding-top: 40px;
    padding-bottom: 20px;
    background: fixed center v-bind(imageBackground);
    background-size: v-bind(backgroundSize);
}

.background-color {
    background-color: v-bind(backgroundColor);
    height: 100%;
}

.result {
    display: flex;
    justify-content: space-between;
    align-content: stretch;
    height: 40px;
    padding: 2px;
    background-color: v-bind(backgroundColor);
}

.button {
    display: flex;
    align-content: stretch;
}

.ql-align-center {
    text-align: center;
}

.ql-align-justify {
    text-align: justify;
}

.ql-align-right {
    text-align: right;
}

.default-font-size {
    font-size: 15px;
}

.bottom-variable {
    width: 100vw;
    color: whitesmoke;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
}

.top-toolbar {
    width: 100vw;
    color: whitesmoke;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
}

li {
    margin-top: 12px;
    padding-top: 0;
    margin-left: 2em;
    padding-left: 0;
}

blockquote {
    border-left: 6px solid #ccc;
    margin: 6px;
    padding: 6px;

}

.version-right {
    text-align: end;
}
</style>