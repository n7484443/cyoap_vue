<template>
  <div v-if="isLoading !== -1" class="spinner-container">
    <v-progress-circular size="72" width="8" :model-value="isLoading / isLoadingMax * 100"
                         color="red"></v-progress-circular>
  </div>
  <v-app v-else class="default-font-size default-padding" :full-height="true">
    <div class="background-color" :style="background">
      <div class="background">
        <error-log></error-log>
        <h5 class="version-right">
          {{ version }}
        </h5>
        <main>
          <div v-for="(n, i) in child" :key="n">
            <LineSetting ref="lineSetting" :pos="i">
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
          <v-dialog v-model="dialog" :scrollable=true>
            <template v-slot:activator="{ props }">
              <v-btn color="primary" class="mx-3" v-bind="props">
                {{ summary }}
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <div class="d-flex flex-wrap">
                  <v-switch class="me-6" hide-details :label="use_default_font_text" v-model="use_default_font"
                            color="red"></v-switch>
                  <v-switch class="me-6" hide-details :label="separate_line_text" v-model="separate_line" color="red"></v-switch>
                  <v-switch class="me-6" hide-details :label="separate_child_text" v-model="separate_child" color="red"></v-switch>
                  <v-slider hide-details class="align-content-center me-6" :label="change_result_size" :max="8" :min="1"
                            :step="1" thumb-label
                            v-model="result_size" show-ticks="always"></v-slider>
<!--                  <v-text-field hide-details :label="split_image_text" min="1" :step="1"-->
<!--                                v-model="split_image" type="number"></v-text-field>-->
                </div>
              </v-card-title>
              <v-card-text :class="use_default_font ? 'selected_result_default_font' : 'selected_result'">
                <SelectedResult ref="selectedResult" :style="background" id="capture" :result_size="result_size"
                                :separate_line="separate_line" :separate_child="separate_child" ></SelectedResult>
              </v-card-text>
              <v-card-actions>
                <v-btn color="primary" @click="saveAsImage">{{ save_as_image }}</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="dialog = false">{{ close }}</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </div>
    </div>
  </v-app>
</template>

<script lang="ts">
import LineSetting from './components/ChoiceLine.vue';
import HorizontalScroll from "./components/HorizontalScroll.vue";
import SelectedResult from "./components/SelectedResult.vue";
import domtoimage from "dom-to-image-more";
import {getCssFromColorOption, getCurrentMaxWidthScreen, getTranslation, useStore} from "@/fn_common";
import ErrorLog from "@/components/ErrorLog.vue";
import {PlatformDesignSetting} from "@/preset/design_setting";
import {ChoiceNodeDesignPreset, ColorOption, ColorType} from "@/preset/node_preset";

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
    let platformResponse = await fetch(url + "platform.json?time=" + new Date().getTime());
    let platform = await platformResponse.text();
    let lineDataResponse = await fetch(url + "nodes/list.json?time=" + new Date().getTime());
    let lineData = await lineDataResponse.json();
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

    let design: PlatformDesignSetting = JSON.parse(window.getPlatformDesign());
    store.setPlatformDesign(design);

    if (design.backgroundImage) {
      this.imageBackground = "url(/dist/images/" + design.backgroundImage.replaceAll(" ", "%20") + ")";
    }
    this.background = getCssFromColorOption(design.backgroundColorOption);
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
    window.addEventListener('resize', () => {
      if (this.currentMaxWidth !== getCurrentMaxWidthScreen()) {
        this.currentMaxWidth = getCurrentMaxWidthScreen()
        this.updateChild();
      }
    });

    let store = useStore();
    store.$onAction(({name, store, args, after, onError}) => {
      if (name == 'needUpdate') {
        after((_) => this.updateChild());
      }
    });
    return {
      isLoading: 0,
      isLoadingMax: 100,
      modelValue: "",
      child: 0,
      imageBackground: "",
      backgroundRepeat: "no-repeat",
      backgroundSize: "auto",
      background: "",
      dialog: false,
      marginVertical: '8px',
      summary: getTranslation('summary'),
      save_as_image: getTranslation('save_as_image'),
      use_default_font_text: getTranslation('use_default_font'),
      use_default_font: false,
      separate_line_text: getTranslation('separate_line'),
      separate_line: true,
      separate_child_text: getTranslation('separate_child'),
      separate_child: true,
      change_result_size: getTranslation('change_result_size'),
      split_image: 1,
      split_image_text: getTranslation('split_image_text'),
      result_size: useStore().isSmallDisplay ? 6 : 4,
      close: getTranslation('close'),
      addedEventListener: false,
      version: 'cyoap_vue version : ' + APP_VERSION,
      currentMaxWidth: getCurrentMaxWidthScreen()
    }
  },
  methods: {
    updateChild() {
      if (this.$refs.horizontalScroll) {
        this.$refs.horizontalScroll.updateList();
      }
      this.$refs.lineSetting.forEach(i => i.updateChild());
      useStore().setErrorLog(window.getErrorLog());
    },
    async saveAsImage() {
      let element = document.querySelector("#capture");
      let blob = await domtoimage.toBlob(element, {});
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

.background {
  padding-top: 40px;
  padding-bottom: 20px;
  background: fixed center v-bind(imageBackground);
  background-size: v-bind(backgroundSize);
}

.background-color {
  background-color: v-bind(background);
  height: 100%;
}

.result {
  display: flex;
  justify-content: space-between;
  align-content: stretch;
  height: 40px;
  padding: 2px;
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
  font-size: 13px;
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


.selected_result_default_font * {
  font-family: 'Roboto', sans-serif !important;
}
</style>