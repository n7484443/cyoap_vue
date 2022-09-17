<template>
  <LoadingSpinner v-if="isLoading">
    <span></span>
  </LoadingSpinner>
  <v-app v-else>
    <v-app-bar elevate-on-scroll="true">
      <v-slide-group show-arrows>
        <v-slide-item v-for="n in 40" :key="n">
          <v-btn color="primary">{{ n }}</v-btn>
        </v-slide-item>
      </v-slide-group>
    </v-app-bar>
    <br/>
    <br/>
    <br/>
    <div v-for="(n, i) in child" :key="n">
      <LineSetting class="item" :pos="i">
      </LineSetting>
    </div>
  </v-app>
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

    for (let i = 0; i < lineData.length; i++) {
      let innerLine = fetch(url + "nodes/" + lineData[i]).then(res => res.text());
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
  }
}
</script>
<style>
.item {
  padding: 8px;
}
.v-slide-group{
  max-width: 100vw;
}
</style>