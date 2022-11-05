<template>
  <div v-if="choiceStatus !== 'hide'">
    <v-responsive min-height="100">
      <v-lazy v-model="isActive">
        <div class="wrapper">
          <ChoiceNode v-for="(n, i) in child" ref="choiceNode" :key="n" :current-pos="[...currentPos, i]"
                      :render-child=true :clickable="true" @needUpdate="needUpdate">
          </ChoiceNode>
        </div>
      </v-lazy>
    </v-responsive>
  </div>
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
    let currentPos = [this.pos];
    return {
      isActive: false,
      currentPos: currentPos,
      child: window.childLength(currentPos),
      choiceStatus: window.getChoiceStatus(currentPos),
      marginVertical: this.$store.getters.getPlatformDesign.marginVertical + 'px',
    }
  },
  methods: {
    updateChild() {
      this.choiceStatus = window.getChoiceStatus(this.currentPos);
      if (this.$refs.choiceNode) {
        this.$refs.choiceNode.forEach(function (i) {
          if (i) {
            i.updateChild();
          }
        });
      }
    },
    needUpdate() {
      this.$emit('needUpdate',);
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
  row-gap: v-bind(marginVertical);
  grid-auto-flow: row;
  padding: 4px;
}

</style>