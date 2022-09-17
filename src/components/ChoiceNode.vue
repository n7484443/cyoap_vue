<template>
  <v-card v-if="choiceStatus !== 'hide'" :class="select ? 'card-outline' : 'card'" v-on:click="click"
          :disabled="choiceStatus === 'closed'">
    <div class="container">
      <v-img :src="image" class="image_round"></v-img>
      <div class="container">
        <p v-html="modelValue"></p>
      </div>
      <div class="multi-select" v-if="choiceMode === 'multiSelect'">
        <v-btn v-on:click="click_down" elevation="0">
          <v-icon>
            {{ mdi_left }}
          </v-icon>
        </v-btn>
        <p class="text-center">
          {{ mdi_right }}
        </p>
        <v-btn v-on:click="click_up" elevation="0">
          <v-icon>
            mdi-chevron-right
          </v-icon>
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
import { mdiChevronLeft } from '@mdi/js';
import { mdiChevronRight } from '@mdi/js';

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
        select: 0,
        choiceStatus: "",
        choiceMode: "defaultMode",
        childLength: 0,
        mdi_left: mdiChevronLeft,
        mdi_right: mdiChevronRight,
      }
    }
    let delta = JSON.parse(data);
    let converter = new QuillDeltaToHtmlConverter(delta, {});
    let imagePos = window.getImage(currentPos);
    if (imagePos) {
      imagePos = "dist/images/" + imagePos;
    }
    return {
      image: imagePos,
      modelValue: converter.convert(),
      currentPos: currentPos,
      gridColumn: window.getSize(currentPos),
      select: window.getSelect(currentPos),
      choiceStatus: window.getChoiceStatus(currentPos),
      choiceMode: window.getChoiceNodeMode(currentPos),
      childLength: window.childLength(currentPos),
      mdi_left: mdiChevronLeft,
      mdi_right: mdiChevronRight,
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
      if(this.$refs.choiceNode){
        this.$refs.choiceNode.forEach(function(i){
          if(i){
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

.multi-select {
  display: flex;
  justify-content: space-around;
  margin-bottom: 8px;
  align-items: center
}

.image_round {
  border-radius: 4px;
}
</style>