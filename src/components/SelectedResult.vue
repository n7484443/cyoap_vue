<template>
  <div class="padding">
    <div v-if="separate_line" v-for="(line, y) in posList" :key="y" class="wrapper mt-6">
      <div v-for="pos in line" :key="pos">
        <ChoiceNode :current-pos="pos" :clickable="false" :render-child="separate_child ? ChoiceNodeChildRender.self : ChoiceNodeChildRender.selected"></ChoiceNode>
      </div>
    </div>
    <div v-else class="wrapper">
      <div v-for="n in posList" :key="n">
        <ChoiceNode :current-pos="n" :clickable="false" :render-child="separate_child ? ChoiceNodeChildRender.self : ChoiceNodeChildRender.selected"></ChoiceNode>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ChoiceNode, {ChoiceNodeChildRender} from "@/components/ChoiceNode.vue";
import {isSmallDisplay, useStore} from "@/fn_common";
import {computed, getCurrentInstance, watch} from 'vue'

const props = defineProps<{
  result_size: Number,
  separate_line: Boolean,
  separate_child: Boolean
}>();

const minWidth = computed(() => {
  if (isSmallDisplay()) {
    return "";
  }
  return "800px";
});

const posList = computed(() => {
  let parsed_pos = JSON.parse(window.getSelectedResult(props.separate_child))
  if (props.separate_line) {
    return parsed_pos;
  }else{
    return parsed_pos.flat()
  }
});


watch(props, () => {
  const instance = getCurrentInstance();
  instance?.proxy?.$forceUpdate();
})

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