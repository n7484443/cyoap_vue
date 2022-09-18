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
    this.isLoading = false;
  },

  data() {
    return {
      isLoading: true,
      modelValue: "",
      child: 0,
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
</style>