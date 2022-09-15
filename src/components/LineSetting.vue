<template>
  <div class="wrapper">
    <ChoiceNode class="item" v-for="(n, i) in child" :key="n" :pos="i" :before-pos="currentPos">
    </ChoiceNode>
  </div>
</template>

<script>
import ChoiceNode from "@/components/ChoiceNode";

export default {
  components: {
    ChoiceNode,
  },
  props: {
    pos : Number,
    beforePos : Array,
  },
  name: "LineSetting",
  data() {
    return {
      currentPos: [...this.beforePos, this.pos],
      child: window.childLength([...this.beforePos, this.pos]),
    }
  },
}
</script>

<style scoped>
.wrapper {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(auto-fill, min-content);
  column-gap: 8px;
  row-gap: 8px;
  grid-auto-flow: row;
}

</style>