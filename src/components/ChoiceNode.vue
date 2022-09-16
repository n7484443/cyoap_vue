<template>
  <div v-if="visible" :class="[showSelectable ? (selected > 0 ? 'card-outline' : 'card') : 'card-disable']"
       :id="currentPos"
       v-on:click="click">
    <div class="container">
      <img :src="image" alt=""/>
      <div class="container">
        <p v-html="modelValue"></p>
      </div>
      <div class="multi-select" v-if="choiceMode == 'multiSelect'">
        <div class="left"></div>
        {{ selected }}
        <div class="right"></div>
      </div>
      <div class="wrapper" v-if="childLength > 0">
        <ChoiceNode class="item" v-for="(n, i) in childLength" :key="n" :pos="i" :before-pos="currentPos">
        </ChoiceNode>
      </div>
    </div>
  </div>
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
        selected: false,
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
    return {
      image: imagePos,
      modelValue: converter.convert(),
      currentPos: currentPos,
      gridColumn: window.getSize(currentPos),
      showSelectable: showSelectable,
      selectable: window.isSelectable(currentPos),
      selected: window.isSelected(currentPos),
      visible: window.isVisible(currentPos),
      choiceMode: choiceMode,
      childLength: window.childLength(currentPos),
    }
  },
  methods: {
    click: function () {
      if (this.selectable) {
        window.select(this.currentPos, 0);
        this.selected = window.isSelected(this.currentPos);
      }
    },
    update: function () {
      this.selectable = window.isSelectable(this.currentPos);
      this.selected = window.isSelected(this.currentPos);
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

.card-disable {
  /* Add shadows to create the "card" effect */
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  grid-column: auto / span v-bind(gridColumn);
  color: #e0e0e0;
}

.card-outline {
  /* Add shadows to create the "card" effect */
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  grid-column: auto / span v-bind(gridColumn);
  outline-color: #fe9616;
  outline-style: solid;
}


/* On mouse-over, add a deeper shadow */
.card:hover {
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
}

/* Add some padding inside the card container */
.container {
  padding: 4px;
}

.container img {
  max-width: 100%;
  height: auto;
  object-fit: contain;
  object-position: 50% 50%;
  margin: auto;
  display: block;
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
</style>