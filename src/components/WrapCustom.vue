<template>
  <div v-for="(line, y) in layout" :key="y">
    <div class="horizontal">
      <div v-for="(n, x) in line" :key="x" :style="{gridColumn: 'auto / span ' + n.width}"
           class="maxHeight">
        <slot v-if="n.pos" :key="n.pos.data" :current-pos="n.pos.data" :index="n.pos.data[n.pos.data.length - 1]">
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ChoiceLineAlignment, SizeData} from '@/preset/line_preset';
import {ref, onMounted} from 'vue'
import {Pos} from "@/preset/default_types";
import {getCurrentMaxWidthScreen, isEqualSizeDataList} from "@/fn_common";

const props = defineProps<{
  pos: Pos,
  choiceLineAlignment: ChoiceLineAlignment,
  maxChildrenPerRow: number,
  marginVertical: string,
}>();

const maxFlex = ref(0);
const marginVertical = ref(props.marginVertical);
const layout = ref<SizeData[][]>();

function updateLayout() {
  actualMaxWidth.value = Math.min(props.maxChildrenPerRow, getCurrentMaxWidthScreen());
  let encodedJson = window.getSizeDataList(props.pos, ChoiceLineAlignment[props.choiceLineAlignment], Math.min(props.maxChildrenPerRow, getCurrentMaxWidthScreen()))
  let decodedJson: { list: SizeData[][], max: number } = JSON.parse(encodedJson)

  if(!isEqualSizeDataList(layout.value, decodedJson.list)) {
    layout.value = decodedJson.list;
  }
  maxFlex.value = decodedJson.max;
}

const actualMaxWidth = ref(0);

onMounted(() => {
  updateLayout();
})

defineExpose({updateLayout, actualMaxWidth})
</script>

<style scoped>
.horizontal {
  display: grid;
  grid-template-columns: repeat(v-bind(maxFlex), minmax(0, 1fr));
  column-gap: 8px;
  row-gap: v-bind(marginVertical);
  grid-auto-flow: row;
  padding: 4px 0px;
}

.maxHeight {
  height: 100%;
}
</style>