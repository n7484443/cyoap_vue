<template>
  <div class="wrapper">
    <!-- item div 속 HelloWorld를 12개 만든다-->
    <div class="item" v-for="i in 100" :key="i">
      <choiceNode>
      </choiceNode>
    </div>
  </div>
</template>

<script>
import choiceNode from './components/choiceNode.vue'

export default {
  name: 'App',

  components: {
    choiceNode,
  },

  data: () => ({
    //
  }),
}
</script>

<style>
.wrapper {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(auto-fill, min-content);
  column-gap: 8px;
  row-gap: 8px;
  grid-auto-flow: row;
}

.item:nth-child(2) {
  grid-column: auto / span 2;
}

.item:nth-child(5) {
  grid-column: auto / span 5;
}

.item:nth-child(6) {
  grid-column: auto / span 4;
}
</style>