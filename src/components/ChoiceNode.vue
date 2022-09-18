<template>
  <v-card v-if="choiceStatus !== 'hide'"
          :class="['card', {outline: select > 0}, choiceNodeDesign['isRound'] ? 'rounded-lg' : 'rounded-0']"
          v-on:click="click"
          :disabled="choiceStatus === 'closed'" :elevation="choiceNodeDesign['isCard'] ? 10 : 0">
    <div class="container">
      <ChoiceNodeContents :imagePosition="choiceNodeDesign['imagePosition']" :image="image" :maximizing-image="choiceNodeDesign['maximizingImage']">
        <template v-slot:title v-if="!choiceNodeDesign['hideTitle']">
          {{ title }}
        </template>
        <template v-slot:contents>
          <p v-html="modelValue" class="container"></p>
        </template>
      </ChoiceNodeContents>
      <div class="multi-select" v-if="choiceMode === 'multiSelect'">
        <v-btn v-on:click="click_down" elevation="0">
          <v-icon icon="mdi:mdi-chevron-left" />
        </v-btn>
        <p class="text-center">
          {{ select }}
        </p>
        <v-btn v-on:click="click_up" elevation="0">
          <v-icon icon="mdi:mdi-chevron-right" />
        </v-btn>
      </div>
      <div class="wrapper" v-if="childLength > 0">
        <ChoiceNode class="item" v-for="(n, i) in childLength" ref="choiceNode" :key="n" :pos="i"
                    :before-pos="currentPos" @needUpdate="needUpdate">
        </ChoiceNode>
      </div>
    </div>
  </v-card>
</template>

<script>
import {QuillDeltaToHtmlConverter} from "quill-delta-to-html";
import ChoiceNodeContents from "./ChoiceNodeContents";

export default {
  props: {
    pos: Number,
    beforePos: Array,
  },
  components: {
    ChoiceNodeContents
  },
  name: "ChoiceNode",
  data() {
    let currentPos = [...this.beforePos, this.pos];
    let data = window.getContents(currentPos);
    let delta = JSON.parse(data);
    let converter = new QuillDeltaToHtmlConverter(delta, {});
    let imagePos = window.getImage(currentPos);
    if (imagePos) {
      imagePos = "dist/images/" + imagePos;
    }
    return {
      image: imagePos,
      title: window.getTitle(currentPos),
      modelValue: converter.convert(),
      currentPos: currentPos,
      gridColumn: window.getSize(currentPos),
      select: window.getSelect(currentPos),
      choiceStatus: window.getChoiceStatus(currentPos),
      choiceMode: window.getChoiceNodeMode(currentPos),
      childLength: window.childLength(currentPos),
      choiceNodeDesign: JSON.parse(window.getChoiceNodeDesign(currentPos)),
    }
  },
  methods: {
    click() {
      window.select(this.currentPos, 0);
      window.updatePlatform();
      this.needUpdate();
    },
    click_down() {
      window.select(this.currentPos, -1);
      window.updatePlatform();
      this.needUpdate();
    },
    click_up() {
      window.select(this.currentPos, 1);
      window.updatePlatform();
      this.needUpdate();
    },
    updateChild() {
      if (this.$refs.choiceNode) {
        this.$refs.choiceNode.forEach(function (i) {
          if (i) {
            i.updateChild();
          }
        });
      }
      this.select = window.getSelect(this.currentPos);
      this.choiceStatus = window.getChoiceStatus(this.currentPos);
    },
    needUpdate() {
      this.$emit('needUpdate',);
    }
  }
}
</script>
<style scoped>
.card {
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2);
  background-color: #fff;
  grid-column: auto / span v-bind(gridColumn);
}

.outline {
  outline-color: #fe9616;
  outline-style: solid;
}

/* Add some padding inside the card container */
.container {
  padding: 4px;
}

.wrapper {
  display: grid;
  grid-template-columns: repeat(v-bind(gridColumn), 1fr);
  grid-template-rows: repeat(auto-fill, min-content);
  column-gap: 8px;
  row-gap: 8px;
  grid-auto-flow: row;
}

.multi-select {
  display: flex;
  justify-content: space-around;
  margin-bottom: 8px;
  align-items: center
}

</style>