<template>
  <v-card v-if="visible" :class="select ? 'card-outline' : 'card'" v-on:click="click" :disabled="!showSelectable">
    <div class="container">
      <v-img :src="image" class="image_round"></v-img>
      <div class="container">
        <p v-html="modelValue"></p>
      </div>
      <div class="multi-select" v-if="choiceMode === 'multiSelect'">
        <div class="left" v-on:click="click_down"></div>
        {{ select }}
        <div class="right" v-on:click="click_up"></div>
      </div>
      <div class="wrapper" v-if="childLength > 0">
        <ChoiceNode class="item" v-for="(n, i) in childLength" :key="n" :pos="i" :before-pos="currentPos">
        </ChoiceNode>
      </div>
    </div>
  </v-card>
</template>

<script>
import {QuillDeltaToHtmlConverter} from "quill-delta-to-html";

export default {
  props: {
    pos: Number,
    beforePos: Array,
  },
  name: "ChoiceNode",
  data() {
    let currentPos = [...this.beforePos, this.pos];
    let data = window.getContents(currentPos);
    if (!data) {
      return {
        image: "",
        modelValue: "",
        currentPos: currentPos,
        gridColumn: 1,
        showSelectable: false,
        selectable: false,
        select: 0,
        visible: false,
        choiceMode: "defaultMode",
        childLength: 0,
      }
    }
    let delta = JSON.parse(data);
    let converter = new QuillDeltaToHtmlConverter(delta, {});
    let imagePos = window.getImage(currentPos);
    if (imagePos) {
      imagePos = "dist/images/" + imagePos;
    }
    let choiceMode = window.getChoiceNodeMode(currentPos);
    let showSelectable = window.isSelectable(currentPos);
    switch (choiceMode) {
      case "unSelectableMode":
        showSelectable = true;
        break;
      case "onlyCode":
        break;
      default:
        break;
    }
    console.log(currentPos);
    return {
      image: imagePos,
      modelValue: converter.convert(),
      currentPos: currentPos,
      gridColumn: window.getSize(currentPos),
      showSelectable: showSelectable,
      selectable: window.isSelectable(currentPos),
      select: window.getSelect(currentPos),
      visible: window.isVisible(currentPos),
      choiceMode: choiceMode,
      childLength: window.childLength(currentPos),
    }
  },
  methods: {
    click: function () {
      if (window.isSelectable(this.currentPos)) {
        window.select(this.currentPos, 0);
        window.updatePlatform();
        this.select = window.getSelect(this.currentPos);
      }
    },
    click_down: function () {
      window.select(this.currentPos, -1);
      window.updatePlatform();
      this.select = window.getSelect(this.currentPos);
    },
    click_up: function () {
      window.select(this.currentPos, 1);
      window.updatePlatform();
      this.select = window.getSelect(this.currentPos);
    },
    update: function () {
      this.selectable = window.isSelectable(this.currentPos);
      this.select = window.getSelect(this.currentPos);
      this.visible = window.isVisible(this.currentPos);
    }
  }
}
</script>
<style scoped>
.card {
  /* Add shadows to create the "card" effect */
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  grid-column: auto / span v-bind(gridColumn);
}

.card-outline {
  /* Add shadows to create the "card" effect */
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.1s;
  grid-column: auto / span v-bind(gridColumn);
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

.left {
  width: 0px;
  height: 0px;
  border-top: 15px solid transparent;
  border-right: 30px solid red;
  border-bottom: 15px solid transparent;
}

.right {
  width: 0px;
  height: 0px;
  border-top: 15px solid transparent;
  border-left: 30px solid red;
  border-bottom: 15px solid transparent;
}

.multi-select {
  display: flex;
  justify-content: space-around;
  margin-bottom: 8px;
}

.image_round{
  border-radius: 4px;
}
</style>