<template>
  <div v-if="choiceNodeOption['isOccupySpace'] && !visible" class="gridStyle"/>
  <div v-else-if="!isHide" class="gridStyle">
    <div class="maxHeight" :style="outlineStyle">
      <v-card class="maxHeight"
              :style="cardStyle"
              v-on:click="click"
              :disabled="!isOpen" :elevation="preset.elevation">
        <div class="container padding">
          <ChoiceNodeContents :imagePosition="preset['imagePosition']" :title="title"
                              :renderAsResult="!renderChild"
                              :preset="preset">
            <template v-slot:contents>
              <p v-html="contentsHtml" class="container content_font"></p>
            </template>
            <template v-slot:image>
              <v-img v-if="renderChild" :src="image" :max-height="imageMaxHeight" class="rounded-xl">
                <template v-slot:placeholder>
                  <v-row class="fill-height ma-0" align="center" justify="center">
                    <v-progress-circular indeterminate color="primary"/>
                  </v-row>
                </template>
              </v-img>
              <img v-else :src="image" class="image-result"/>
            </template>
          </ChoiceNodeContents>
          <div v-if="choiceMode === 'multiSelect'">
            <div v-if="choiceNodeOption.showAsSlider" class="multi-select-slider">
              <v-slider :min="0" :max="choiceMaximumStatus" :step="1" thumb-label
                        v-on:update:model-value="click_slider"
                        :model-value="select"></v-slider>
              <p class="text-center">{{ select }}</p>
            </div>
            <div v-else class="multi-select">
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
  </div>

</template>

<script lang="ts">
import {QuillDeltaToHtmlConverter} from "quill-delta-to-html";
import ChoiceNodeContents from "@/components/ChoiceNodeContents.vue";
import {useStore} from "@/fn_common";
import {ColorOption, ColorType, GradientType, OutlineOption, OutlineType} from "@/preset/node_preset.ts";

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
  computed: {
    currentOutline(): OutlineOption {
      let defaultOutlineOption = this.preset.defaultOutlineOption;
      let selectOutlineOption = this.preset.selectOutlineOption;
      return this.select > 0 && this.preset.selectOutlineEnable ? selectOutlineOption : defaultOutlineOption;
    },
    currentColor(): ColorOption {
      let defaultColorOption = this.preset.defaultColorOption;
      let selectColorOption = this.preset.selectColorOption;
      return this.select > 0 && this.preset.selectColorEnable ? selectColorOption : defaultColorOption;
    },
    outlineStyle() {//border 로 구현
      return {
        "border-width": this.currentOutline.outlineWidth + "px",
        "border-color": this.$getColor(this.currentOutline.outlineColor.color),
        "border-style": this.currentOutline.outlineType !== OutlineType.none ? this.currentOutline.outlineType : "",
        "padding": (this.currentOutline.outlinePadding + 2).toString() + "px",
        "border-radius": this.preset.roundEdge.map(function(element:number): string{
          return element + "px";
        }).join(" "),
      }
    },
    cardStyle() {
      console.log(this.currentColor)
      let outputCss = this.$getCssFromColorOption(this.currentColor);
      outputCss["border-radius"] = this.preset.roundEdge.map(function(element:number): string{
        return element + "px";
      }).join(" ");
      return outputCss;
    },
    isHide() {
      return this.choiceStatus.isHide;
    },
    isOpen() {
      return this.choiceStatus.isOpen;
    }
  },
  data() {
    const store = useStore();
    let contentsString = window.getContents(this.currentPos);
    let contentsHtml = this.htmlFromQuill(contentsString);
    let imagePos = window.getImage(this.currentPos);
    if (imagePos) {
      imagePos = "dist/images/" + imagePos;
    }

    let choiceNodeOption = JSON.parse(window.getChoiceNodeOption(this.currentPos));
    let preset = store.getNodePresets.get(choiceNodeOption['presetName']);
    if (!preset) {
      store.errorLog.push("ChoiceNode: preset is not exist. (presetName: " + choiceNodeOption.presetName +
          " | pos: " + this.currentPos +
          " | name: " + window.getTitle(this.currentPos) + ")");
      preset = JSON.parse(window.getNodeDefaultPreset());
    }
    let select = window.getSelect(this.currentPos)

    let choiceStatus = window.getChoiceStatus(this.currentPos);
    let choiceMode = window.getChoiceNodeMode(this.currentPos);
    let gridColumn = window.getSize(this.currentPos);

    return {
      image: imagePos.replaceAll(" ", "%20"),
      imageMaxHeight: preset['maximizingImage'] ? '80vh' : '50vh',
      title: window.getTitle(this.currentPos),
      contentsHtml: contentsHtml,
      contentsString: contentsString,
      originalWidth: gridColumn,
      viewWidth: Math.min(gridColumn, store.getCurrentMaxWidth),
      select: select,
      choiceStatus: choiceStatus,
      choiceMode: choiceMode,
      choiceMaximumStatus: window.getMaximumStatus(this.currentPos),
      childLength: window.childLength(this.currentPos),
      choiceNodeOption: choiceNodeOption,
      preset: preset,
      paddingAround: preset.paddingAround.map(function(element:number): string{
        return element + "px";
      }).join(" "),
      mainFont: this.$getFont(preset['mainFont'])
    }
  },
  methods: {
    htmlFromQuill(data) {
      let modalValue = "";
      if (data && data !== "") {
        let delta = JSON.parse(data);
        let converter = new QuillDeltaToHtmlConverter(delta, {
          inlineStyles: {
            size: {
              'small': 'font-size: 10px',
              'large': 'font-size: 18px',
              'huge': 'font-size: 22px'
            },
          }
        });
        modalValue = converter.convert();
      }
      return modalValue;
    },
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
    click_slider(number) {
      if (this.clickable) {
        window.select(this.currentPos, number - this.select);
        window.updatePlatform();
        this.needUpdate();
      }
    },
    updateChild() {
      const store = useStore();
      let newContents = window.getContents(this.currentPos);
      if (this.contentsString !== newContents) {
        this.contentsString = newContents;
        this.contentsHtml = this.htmlFromQuill(newContents);
      }
      this.select = window.getSelect(this.currentPos);
      this.choiceStatus = window.getChoiceStatus(this.currentPos);
      this.viewWidth = Math.min(this.originalWidth, store.getCurrentMaxWidth);

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
  grid-column: auto / span v-bind(viewWidth);
}

.maxHeight {
  height: 100%;
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
  grid-template-columns: repeat(v-bind(viewWidth), 1fr);
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

.multi-select-slider {
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
  align-items: stretch;
  flex-direction: column;
}

.padding {
  padding: v-bind(paddingAround);
}

.image-result {
  max-height: v-bind(imageMaxHeight);
  object-fit: contain;
  width: 100%;
}

.content_font {
  font-family: v-bind(mainFont);
}

</style>