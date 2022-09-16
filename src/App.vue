<template>
  <LoadingSpinner v-if="isLoading">
    <span></span>
  </LoadingSpinner>
  <div v-else>
    <div v-for="(n, i) in child" :key="n">
      <LineSetting class="item" :pos="i">
      </LineSetting>
    </div>
  </div>
</template>

<script>
import LineSetting from './components/LineSetting.vue';
import LoadingSpinner from "@/components/LoadingSpinner";

export default {
  name: 'App',

  components: {
    LoadingSpinner,
    LineSetting,
  },

  async created() {
    const url = "/dist/";
    let platform = await fetch(url + "platform.json");
    platform = await platform.text();
    let lineData = await fetch(url + "nodes/list.json");
    lineData = await lineData.json();
    let lineSetting = [];
    for (let dataName in lineData) {
      let innerLine = await fetch(url + "nodes/" + lineData[dataName]);
      innerLine = await innerLine.text();
      lineSetting.push(innerLine);
    }
    this.child = lineSetting.length;
    window.loadPlatform(platform, lineSetting);
    this.isLoading = false;
  },

  data() {
    return {
      isLoading: true,
      modelValue: "",
      child: 0,
    }
  }
}
</script>
<style>
.item{
  padding: 8px;
}
</style>