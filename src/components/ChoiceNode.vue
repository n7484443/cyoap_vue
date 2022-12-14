<template>
  <div v-if="choiceNodeOption['isOccupySpace'] && !visible" class="gridStyle"/>
  <div v-else-if="visible" class="gridStyle">
    <v-card :class="['card', {'outline': select > 0}]"
            v-on:click="click"
            :disabled="choiceStatus === 'closed'" :elevation="preset.elevation"
            :color="colorNode">
      <div class="container">
        <ChoiceNodeContents :imagePosition="preset['imagePosition']" :title="title" :renderAsResult="!renderChild"
                            :preset="preset">
          <template v-slot:contents>
            <p v-html="modelValue" class="container content_font"></p>
          </template>
          <template v-slot:image>
            <v-img v-if="renderChild" :src="image" :max-height="imageMaxHeight">
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular indeterminate color="primary"/>
                </v-row>
              </template>
            </v-img>
            <img v-else :src="image" class="image-result"/>
          </template>
        </ChoiceNodeContents>
        <div class="multi-select" v-if="choiceMode === 'multiSelect'">
          <v-btn v-on:click="click_down" variant="tonal">
            <v-icon icon="mdi:mdi-chevron-left"/>
          </v-btn>
          <p class="text-center">
            {{ select }}
          </p>
          <v-btn v-on:click="click_up" variant="tonal">
            <v-icon icon="mdi:mdi-chevron-right"/>
          </v-btn>
        </div>
        <div class="wrapper" v-if="childLength > 0 && renderChild">
          <ChoiceNode class="item" v-for="(n, i) in childLength" ref="choiceNodeChild" :key="n"
                      :currentPos="[...currentPos, i]" :render-child="renderChild" :clickable="clickable"
                      @needUpdate="needUpdate">
          </ChoiceNode>
        </div>
      </div>
    </v-card>
  </div>

</template>

<script>
import {QuillDeltaToHtmlConverter} from "quill-delta-to-html";
import ChoiceNodeContents from "./ChoiceNodeContents";

export default {
  props: {
    currentPos: Array,
    renderChild: Boolean,
    clickable: Boolean,
  },
  components: {
    ChoiceNodeContents
  },
  name: "ChoiceNode",
  data() {
    let data = window.getContents(this.currentPos);
    let modalValue = "";
    if (data && data !== "") {
      let delta = JSON.parse(data);
      let converter = new QuillDeltaToHtmlConverter(delta, {
        inlineStyles: {
          size: {
            'small': 'font-size: 0.75em',
            'large': 'font-size: 1.25em',
            'huge': 'font-size: 1.5em'
          },
        }
      });
      modalValue = converter.convert();
    }
    let imagePos = window.getImage(this.currentPos);
    if (imagePos) {
      imagePos = "/dist/images/" + imagePos;
    }

    let choiceNodeOption = JSON.parse(window.getChoiceNodeOption(this.currentPos));
    let preset = this.$store.getters.getNodePresets[choiceNodeOption['presetName']];

    let colorSelectNode = (preset.colorSelectNode ?? 0xFF40C4FF).toString(16);
    colorSelectNode = '#' + colorSelectNode.substring(2) + colorSelectNode.substring(0, 2);

    let colorNode = (preset.colorNode ?? preset.colorNode ?? 0xFFFFFFFF).toString(16);
    colorNode = '#' + colorNode.substring(2) + colorNode.substring(0, 2);

    let choiceStatus = window.getChoiceStatus(this.currentPos);
    let choiceMode = window.getChoiceNodeMode(this.currentPos);
    let gridColumn = window.getSize(this.currentPos);
    if (!choiceNodeOption['occupySpace'] && choiceStatus === 'hide') {
      gridColumn = 0;
    }

    let visible = choiceStatus !== 'hide' && choiceMode !== 'onlyCode';
    return {
      image: imagePos.replaceAll(" ", "%20"),
      imageMaxHeight: preset['maximizingImage'] ? '80vh' : '50vh',
      title: window.getTitle(this.currentPos),
      modelValue: modalValue,
      gridColumn: gridColumn,
      select: window.getSelect(this.currentPos),
      choiceStatus: choiceStatus,
      choiceMode: choiceMode,
      childLength: window.childLength(this.currentPos),
      choiceNodeOption: choiceNodeOption,
      colorOutline: colorSelectNode,
      colorNode: colorNode,
      visible: visible,
      preset: preset,
      round: preset.round + "px",
    }
  },
  methods: {
    click() {
      if (this.clickable) {
        window.select(this.currentPos, 0);
        window.updatePlatform();
        this.needUpdate();
      }
    },
    click_down() {
      if (this.clickable) {
        window.select(this.currentPos, -1);
        window.updatePlatform();
        this.needUpdate();
      }
    },
    click_up() {
      if (this.clickable) {
        window.select(this.currentPos, 1);
        window.updatePlatform();
        this.needUpdate();
      }
    },
    updateChild() {
      this.select = window.getSelect(this.currentPos);
      this.choiceStatus = window.getChoiceStatus(this.currentPos);
      this.visible = this.choiceStatus !== 'hide' && this.choiceMode !== 'onlyCode';
      if (!this.choiceNodeOption['occupySpace'] && this.choiceStatus === 'hide') {
        this.gridColumn = 0;
      } else {
        this.gridColumn = window.getSize(this.currentPos);
      }
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

.gridStyle {
  grid-column: auto / span v-bind(gridColumn);
}

.card {
  background-color: v-bind(colorNode);
  height: 100%;
  border-radius: v-bind(round);
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

.image-result {
  max-height: v-bind(imageMaxHeight);
  object-fit: contain;
  width: 100%;
}

.content_font {
  font-family: v-bind(preset ['mainFont']);
  font-size: calc(8.75px + 0.33vw);
}

</style>