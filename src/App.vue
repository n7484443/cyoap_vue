<template>
  <div v-if="isLoading !== -1" class="spinner-container">
    <v-progress-circular size="72" width="8" :model-value="isLoading / isLoadingMax * 100"
                         color="red"></v-progress-circular>
  </div>
  <v-app v-else>
    <v-bottom-navigation height="40">
      <HorizontalScroll ref="horizontalScroll">
      </HorizontalScroll>
    </v-bottom-navigation>

    <div class="background">
      <v-btn color="primary" variant="text" icon="mdi-content-save" v-on:click="saveCurrentStatus" />
      <v-btn color="primary" variant="text" icon="mdi-upload" v-on:click="loadCurrentStatus" />
      <div v-for="(n, i) in child" :key="n">
        <LineSetting ref="lineSetting" :pos="i" @needUpdate="needUpdate">
        </LineSetting>
      </div>

      <div class="result my-3">
        <v-dialog v-model="dialog" scrollable>
          <template v-slot:activator="{ props }">
            <v-btn color="primary" class="mx-3" v-bind="props">
              결과창 보기
            </v-btn>
          </template>
          <v-card>
            <v-card-text>
              <SelectedResult id="capture"></SelectedResult>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" @click="saveAsImage">이미지로 저장</v-btn>
              <v-btn color="primary" @click="dialog = false">결과창 닫기</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
      <br/>
      <br/>
      <br/>
      <br/>
    </div>
  </v-app>
</template>

<script>
import LineSetting from './components/LineSetting.vue';
import HorizontalScroll from "./components/HorizontalScroll.vue";
import WebFont from "webfontloader/webfontloader";
import SelectedResult from "./components/SelectedResult.vue";
import domtoimage from "dom-to-image-more";

export default {
  name: 'App',

  components: {
    LineSetting,
    HorizontalScroll,
    SelectedResult
  },

  async created() {
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
    };
    let design = JSON.parse(window.getPlatformDesign());
    this.$store.commit('setPlatformDesign', design);
    let nodePresetList = JSON.parse(window.getNodePresetList());
    let linePresetList = JSON.parse(window.getLinePresetList());
    let fontHashSet = new Set();
    nodePresetList.forEach(function(e){
      fontHashSet.add(e['titleFont']);
      fontHashSet.add(e['mainFont']);
    });
    this.$store.commit('setNodePresets', nodePresetList);
    this.$store.commit('setLinePresets', linePresetList);
    this.variableFont = textFontList[design['variableFont']];
    WebFont.load({
      google: {
        families: [...fontHashSet, this.variableFont]
      }
    });

    if (design.backgroundImage) {
      this.imageBackground = "url(/dist/images/" + design.backgroundImage.replaceAll(" ", "%20") + ")";
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
        this.backgroundSize = "100vw 100vh";
        break;
    }
    this.marginVertical = design.marginVertical + 'px';
    this.isLoading = -1;
  },

  data() {
    return {
      isLoading: 0,
      isLoadingMax: 100,
      modelValue: "",
      child: 0,
      variableFont: "",
      imageBackground: "",
      backgroundRepeat: "no-repeat",
      backgroundSize: "auto",
      dialog: false,
      marginVertical: '8px',
    }
  },
  methods: {
    updateChild() {
      this.$refs.horizontalScroll.updateList();
      this.$refs.lineSetting.forEach(i => i.updateChild());
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
    saveCurrentStatus(){
      let data = window.getSelectedPos();
      let blob = new Blob([data], {type: "text/plain;charset=utf-8"});
      let link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = "save.json";
      link.click();
    },
    loadCurrentStatus(){
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
    }
  }
}
</script>
<style>

*::-webkit-scrollbar {
  width: 16px;
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
  font-size: calc(8.75px + 0.33vw);
}

.background {
  background: v-bind(imageBackground);
  background-attachment: fixed;
  background-size: v-bind(backgroundSize);
  background-position: center;
}

.result {
  display: flex;
  justify-content: center;
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
</style>