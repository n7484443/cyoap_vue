<template>
  <v-card v-if="choiceStatus !== 'hide'"
          :class="['card', {'outline': select > 0}, choiceNodeDesign['isRound'] ? 'rounded-lg' : 'rounded-0']"
          v-on:click="click"
          :disabled="choiceStatus === 'closed'" :elevation="choiceNodeDesign['isCard'] ? 10 : 0">
    <div class="container">
      <ChoiceNodeContents :imagePosition="choiceNodeDesign['imagePosition']" :image="image"
                          :maximizing-image="choiceNodeDesign['maximizingImage']"
                          :hide-title="choiceNodeDesign['hideTitle']" :title="title">
        <template v-slot:contents>
          <p v-html="modelValue" class="container content_font"></p>
        </template>
      </ChoiceNodeContents>
      <div class="multi-select" v-if="choiceMode === 'multiSelect'">
        <v-btn v-on:click="click_down" elevation="0">
          <v-icon icon="mdi:mdi-chevron-left"/>
        </v-btn>
        <p class="text-center">
          {{ select }}
        </p>
        <v-btn v-on:click="click_up" elevation="0">
          <v-icon icon="mdi:mdi-chevron-right"/>
        </v-btn>
      </div>
      <div class="wrapper" v-if="childLength > 0">
        <ChoiceNode class="item" v-for="(n, i) in childLength" ref="choiceNodeChild" :key="n"
                    :pos="i" :before-pos="currentPos" @needUpdate="needUpdate">
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

    let platformDesign = this.$store.getters.getPlatformDesign;
    let colorOutline = (platformDesign.colorOutline ?? 0xFF40C4FF).toString(16);
    colorOutline = '#' + colorOutline.substring(2) + colorOutline.substring(0, 2);

    let colorNode = (platformDesign.colorNode ?? 0xFFFFFFFF).toString(16);
    colorNode = '#' + colorNode.substring(2) + colorNode.substring(0, 2);
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
      colorOutline: colorOutline,
      colorNode: colorNode,
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
      this.select = window.getSelect(this.currentPos);
      this.choiceStatus = window.getChoiceStatus(this.currentPos);
      if (this.$refs.choiceNodeChild) {
        this.$refs.choiceNodeChild.forEach(function (i) {
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
.card {
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2);
  background-color: v-bind(colorNode);
  grid-column: auto / span v-bind(gridColumn);
}

.outline {
  outline-color: v-bind(colorOutline);
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