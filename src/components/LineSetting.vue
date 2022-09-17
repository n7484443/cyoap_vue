<template>
  <v-responsive min-height="100">
    <v-lazy v-model="isActive">
      <div class="wrapper">
        <ChoiceNode v-for="(n, i) in child" ref="choiceNode" :key="n" :pos="i" :before-pos="currentPos" @needUpdate="needUpdate">
        </ChoiceNode>
      </div>
    </v-lazy>
  </v-responsive>
</template>

<script>
import ChoiceNode from "@/components/ChoiceNode";

export default {
  components: {
    ChoiceNode,
  },
  props: {
    pos: Number,
  },
  name: "LineSetting",
  data() {
    return {
      isActive: false,
      currentPos: [this.pos],
      child: window.childLength([this.pos]),
    }
  },
  methods: {
    updateChild(){
      if(this.$refs.choiceNode){
        this.$refs.choiceNode.forEach(function(i){
          if(i){
            i.updateChild();
          }
        });
      }
    },
    needUpdate(){
      this.$emit('needUpdate', );
    }
  }
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