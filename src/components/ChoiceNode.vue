<template>
  <!-- v-card의 elevation을 4으로 -->
  <div class="card" :id="currentPos">
    <div class="container">
      <p v-html="modelValue"></p>
    </div>
  </div>
</template>

<script>
import {QuillDeltaToHtmlConverter} from "quill-delta-to-html";

export default {
  props: {
    pos : Number,
    beforePos : Array,
  },
  name: "ChoiceNode",
  data() {
    this.currentPos = [...this.beforePos, this.pos];
    let data = window.getContents(this.currentPos);
    if(!data){
      return {
        modelValue: "",
        currentPos: Array,
        gridColumn: 1
      }
    }
    let delta = JSON.parse(data);
    let converter = new QuillDeltaToHtmlConverter(delta, {});
    return {
      modelValue: converter.convert(),
      currentPos: Array,
      gridColumn: window.getSize(this.currentPos)
    }
  },
}
</script>
<style scoped>
.card {
  /* Add shadows to create the "card" effect */
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  transition: 0.3s;
  grid-column: auto / span v-bind(gridColumn);
}

/* On mouse-over, add a deeper shadow */
.card:hover {
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
}

/* Add some padding inside the card container */
.container {
  padding: 2px 16px;
}
</style>