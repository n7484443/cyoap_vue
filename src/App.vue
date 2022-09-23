<template>
  <div v-if="isLoading" class="spinner-container">
    <v-progress-circular size="72" width="8" indeterminate color="red"></v-progress-circular>
  </div>
  <v-app v-else>
    <v-bottom-navigation>
      <HorizontalScroll ref="horizontalScroll">
      </HorizontalScroll>
    </v-bottom-navigation>
    <div v-for="(n, i) in child" :key="n" class="background">
      <LineSetting class="item" ref="lineSetting" :pos="i" @needUpdate="needUpdate">
      </LineSetting>
    </div>
    <br/>
    <div class="result">
      <v-dialog v-model="dialog" scrollable>
        <template v-slot:activator="{ props }">
          <v-btn
              color="primary"
              v-bind="props"
          >
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
    const url = "/dist/";
    let platform = await fetch(url + "platform.json?time=" + new Date().getTime());
    platform = await platform.text();
    let lineData = await fetch(url + "nodes/list.json?time=" + new Date().getTime());
    lineData = await lineData.json();
    let lineSetting = [];

    for (let i = 0; i < lineData.length; i++) {
      let innerLine = fetch(url + "nodes/" + lineData[i] + "?time=" + new Date().getTime()).then(res => res.text());
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
    this.titleFont = textFontList[design['titleFont']];
    this.contentFont = textFontList[design['mainFont']];
    this.variableFont = textFontList[design['variableFont']];
    WebFont.load({
      google: {
        families: [this.titleFont, this.contentFont, this.variableFont]
      }
    });

    let color = (design.colorBackground ?? 0xFFFFFFFF).toString(16);
    this.colorBackground = '#' + color.substring(2) + color.substring(0, 2);
    this.isLoading = false;
  },

  data() {
    return {
      isLoading: true,
      modelValue: "",
      child: 0,
      titleFont: "",
      contentFont: "",
      variableFont: "",
      colorBackground: "",
      dialog: false,
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
    async saveAsImage(){
      let element = document.querySelector("#capture");
      let blob = await domtoimage.toBlob(element, );
      //blob download as result.png
      let link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = "result.png";
      link.click();

      // let canvas = await html2canvas(element)
      // let a = document.createElement('a');
      // a.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      // a.download = 'result.png';
      // a.click();
    }
  }
}
</script>
<style>
.item {
  padding: 8px;
}

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

.title_font {
  font-family: v-bind(titleFont);
}

.content_font {
  font-family: v-bind(contentFont);
}

.variable_font {
  font-family: v-bind(variableFont);
}

.background{
  background-color: v-bind(colorBackground);
}

.result{
  display: flex;
  justify-content: center;
}
</style>