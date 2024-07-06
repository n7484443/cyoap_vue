<template>
  <div v-if="choiceNodeOption['isOccupySpace'] && isHide" class="maxHeight"/>
  <div v-else-if="!isHide" class="maxHeight">
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
          <div v-if="childLength > 0 && renderChild">
            <WrapCustom ref="wrapCustom" margin-vertical="0.0" :pos="currentPos" :max-children-per-row="viewWidth"
                        :choice-line-alignment="ChoiceLineAlignment.left" @needUpdate="needUpdate" v-slot="slotProps">
              <ChoiceNode class="item" :ref="'choiceNodeChild.'+slotProps.index" :render-child="renderChild"
                          :clickable="clickable"
                          @needUpdate="needUpdate" :current-pos="slotProps.currentPos">
              </ChoiceNode>
            </WrapCustom>
          </div>
        </div>
      </v-card>
    </div>
  </div>

</template>

<script lang="ts">
import {QuillDeltaToHtmlConverter} from "quill-delta-to-html";
import {DEFAULT_INLINE_STYLES} from "quill-delta-to-html/src/OpToHtmlConverter";
import ChoiceNodeContents from "@/components/ChoiceNodeContents.vue";
import {getCurrentMaxWidthScreen, getColor, getFont, useStore, getCssFromColorOption} from "@/fn_common";
import {ColorOption, ColorType, GradientType, OutlineOption, OutlineType} from "@/preset/node_preset.ts";
import WrapCustom from "@/components/WrapCustom.vue";
import {ChoiceLineAlignment} from "@/preset/line_preset";

export default {
  props: {
    currentPos: Object as number[],
    renderChild: Boolean,
    clickable: Boolean,
  },
  components: {
    WrapCustom,
    ChoiceNodeContents
  },
  name: "ChoiceNode",
  computed: {
    ChoiceLineAlignment() {
      return ChoiceLineAlignment
    },
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
        "border-color": getColor(this.currentOutline.outlineColor.color),
        "border-style": this.currentOutline.outlineType !== OutlineType.none ? this.currentOutline.outlineType : "",
        "padding": (this.currentOutline.outlinePadding + 2).toString() + "px",
        "border-radius": this.preset.roundEdge.map(function (element: number): string {
          return element + "px";
        }).join(" "),
      }
    },
    cardStyle() {
      let outputCss = getCssFromColorOption(this.currentColor);
      outputCss["border-radius"] = this.preset.roundEdge.map(function (element: number): string {
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
      viewWidth: gridColumn,
      select: select,
      choiceStatus: choiceStatus,
      choiceMode: choiceMode,
      choiceMaximumStatus: window.getMaximumStatus(this.currentPos),
      childLength: window.childLength(this.currentPos),
      choiceNodeOption: choiceNodeOption,
      preset: preset,
      paddingAround: preset.paddingAround.map(function (element: number): string {
        return element + "px";
      }).join(" "),
      mainFont: getFont(preset['mainFont'])
    }
  },
  methods: {
    htmlFromQuill(data) {
      let modalValue = "";
      let old_size = {
        'small': 'font-size: 10px',
        'large': 'font-size: 18px',
        'huge': 'font-size: 22px'
      };
      if (data && data !== "") {
        let delta = JSON.parse(data.replaceAll("_regular", ""));
        DEFAULT_INLINE_STYLES.size = (value, op): string => {
          if (value in old_size) {
            return old_size[value]!;
          }
          return `font-size: ${value}px`;
        }
        DEFAULT_INLINE_STYLES.font = (value, op) => {
          return `font-family: ${getFont(value)}`;
        }
        let converter = new QuillDeltaToHtmlConverter(delta, {
          inlineStyles: DEFAULT_INLINE_STYLES
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

      for (let i = 0; i < this.childLength; i++) {
        if(this.$refs['choiceNodeChild.' + i]){
          this.$refs['choiceNodeChild.' + i].updateChild();
        }
      }
    },
    needUpdate() {
      this.$emit('needUpdate',);
    }
  }
}
</script>
<style scoped>
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