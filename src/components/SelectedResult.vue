<template>
  <div class="padding">
    <div v-if="this.separate_line" v-for="(line, y) in posList" :key="y" class="wrapper mt-6">
      <div v-for="(node, index) in line" :key="index">
        <ChoiceNode :current-pos="node" :clickable="false" :render-child="!separate_child"></ChoiceNode>
      </div>
    </div>
    <div v-else class="wrapper">
      <div v-for="n in posList" :key="n">
        <ChoiceNode :current-pos="n" :clickable="false" :render-child="!separate_child"></ChoiceNode>
      </div>
    </div>
  </div>
</template>

<script>
import ChoiceNode from "@/components/ChoiceNode.vue";
import {isSmallDisplay, useStore} from "@/fn_common";

export default {
  name: "SelectedResult",
  components: {
    ChoiceNode
  },
  props: {
    result_size: Number,
    separate_line: Boolean,
    separate_child: Boolean
  },
  computed: {
    minWidth() {
      const store = useStore();
      if (store.isSmallDisplay) {
        return "";
      }
      return "800px";
    },
    posList() {
      let parsed_pos = JSON.parse(window.getSelectedResult(this.separate_child))
      if (this.separate_line) {
        return parsed_pos;
      }
      return parsed_pos.flat()
    }
  },
}
</script>

<style scoped>
.padding {
  padding: 3px;
  min-width: v-bind(minWidth);
}

.wrapper {
  display: grid;
  grid-template-columns: repeat(v-bind(result_size), minmax(0, 1fr));
  grid-template-rows: repeat(auto-fill, min-content);
  column-gap: 8px;
  row-gap: 8px;
  grid-auto-flow: row;
}
</style>