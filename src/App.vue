<template>
  <div v-if="isLoading" class="spinner-container">
    <v-progress-circular size="72" width="8" indeterminate color="red"></v-progress-circular>
  </div>
  <v-app v-else>
    <v-bottom-navigation>
      <HorizontalScroll ref="horizontalScroll">
      </HorizontalScroll>
    </v-bottom-navigation>
    <div v-for="(n, i) in child" :key="n">
      <LineSetting class="item" ref="lineSetting" :pos="i" @needUpdate="needUpdate">
      </LineSetting>
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

export default {
  name: 'App',

  components: {
    LineSetting,
    HorizontalScroll,
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
    this.titleFont = textFontList[design['titleFont']];
    this.contentFont = textFontList[design['mainFont']];
    this.variableFont = textFontList[design['variableFont']];
    WebFont.load({
      google: {
        families: [this.titleFont, this.contentFont, this.variableFont]
      }
    });
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
    }
  },
  methods: {
    updateChild() {
      this.$refs.horizontalScroll.updateList();
      this.$refs.lineSetting.forEach(i => i.updateChild());
    },
    needUpdate() {
      this.updateChild();
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
</style>