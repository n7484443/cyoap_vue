<template>
  <div :class="[showSelectable ? (selected ? 'card-outline' : 'card') : 'card-disable']" :id="currentPos"
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
    let selected = window.isSelected(currentPos);
    switch (choiceMode) {
      case "unSelectableMode":
        showSelectable = true;
        selected = false;
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
      selected: selected,
      choiceMode: choiceMode,
      childLength: window.childLength(currentPos),
    }
  },
  methods: {
    click: function () {
      if (this.selectable) {
        this.selected = !this.selected;
        window.select(this.currentPos);
      }
    },
    update: function () {
      this.gridColumn = window.getSize(this.currentPos);
      this.selectable = window.isSelectable(this.currentPos);
      this.selected = window.isSelected(this.currentPos);
      this.childLength = window.childLength(this.currentPos);
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
</style>