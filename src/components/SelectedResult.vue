<template>
  <div class="padding">
    <div class="wrapper">
      <div v-for="n in posList" :key="n" >
        <ChoiceNode :current-pos="n" :clickable="false" :render-child="false"></ChoiceNode>
      </div>
    </div>
  </div>
</template>

<script>
import ChoiceNode from "@/components/ChoiceNode";

export default {
  name: "SelectedResult",
  components: {
    ChoiceNode
  },
  data() {
    let platformDesign = this.$store.getters.getPlatformDesign;
    let color = (platformDesign.backgroundColor ?? 0xFFFFFFFF).toString(16);
    color = '#' + color.substring(2);
    return {
      posList: JSON.parse(window.getSelectedPos()).map((n) => n['pos']),
      backgroundColor: color,
    }
  },
}
</script>

<style scoped>
.padding{
  padding: 8px;
  background-color: v-bind(backgroundColor);
}
.wrapper {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(auto-fill, min-content);
  column-gap: 8px;
  row-gap: 8px;
  grid-auto-flow: row;
}
</style>