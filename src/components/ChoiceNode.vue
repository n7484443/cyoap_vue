<template>
  <div v-if="renderSelf">
    <div v-if="choiceNodeOption['isOccupySpace'] && isHide" class="maxHeight"/>
    <div v-else-if="!isHide" class="maxHeight">
      <div class="maxHeight" :style="outlineStyle">
        <v-card class="maxHeight"
                :style="cardStyle"
                v-on:click="click"
                :disabled="!isOpen" :elevation="preset.elevation">
          <div class="container padding">
            <ChoiceNodeContents :imagePosition="preset['imagePosition']" :title="title"
                                :renderAsResult="props.renderChild !== ChoiceNodeChildRender.default"
                                :preset="preset">
              <template v-slot:contents>
                <p v-html="contentsHtml" class="container content_font"></p>
              </template>
              <template v-slot:image>
                <v-img v-if="props.renderChild === ChoiceNodeChildRender.default" :src="image"
                       :max-height="imageMaxHeight"
                       class="rounded-xl">
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
                <v-slider :min="0" :max="choiceMaximumStatus" :step="1" thumb-label color="blue" hide-details
                          v-on:update:model-value="click_slider"
                          :model-value="select" class="slider" :thumb-color="sliderThumbColor"
                          :track-color="sliderTrackInactiveColor" :track-fill-color="sliderTrackActiveColor"
                          thumb-size="20px"></v-slider>
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
            <div v-if="childLength > 0 && props.renderChild !== ChoiceNodeChildRender.self">
              <WrapCustom ref="wrapCustom" margin-vertical="0.0" :pos="currentPos"
                          :max-children-per-row="props.renderChild === ChoiceNodeChildRender.selected ? 1 : viewWidth"
                          :choice-line-alignment="ChoiceLineAlignment.left" v-slot="slotProps">
                <ChoiceNode class="item" :ref="el => choiceNodeChild[slotProps.index] = el "
                            :render-child="props.renderChild"
                            :clickable="clickable" :current-pos="slotProps.currentPos">
                </ChoiceNode>
              </WrapCustom>
            </div>
          </div>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export const enum ChoiceNodeChildRender {
  default, self, selected
}
</script>
<script setup lang="ts">
import {QuillDeltaToHtmlConverter} from "quill-delta-to-html";
import {DEFAULT_INLINE_STYLES} from "quill-delta-to-html/src/OpToHtmlConverter";
import ChoiceNodeContents from "@/components/ChoiceNodeContents.vue";
import {getColor, getFont, useStore, getCssFromColorOption} from "@/fn_common";
import {
  ChoiceNodeDesignPreset,
  ColorOption,
  ColorType,
  GradientType,
  OutlineOption,
  OutlineType, SliderThumbShape
} from "@/preset/node_preset";
import WrapCustom from "@/components/WrapCustom.vue";
import {ChoiceLineAlignment} from "@/preset/line_preset";
import {ref, computed, onBeforeUpdate} from 'vue'


const props = defineProps<{
  currentPos: number[],
  renderChild: ChoiceNodeChildRender,
  clickable: boolean,
}>();
const wrapCustom = ref(null);

const store = useStore();
let contentsString = ref(window.getContents(props.currentPos));
let contentsHtml = computed(() => {
  let modelValue = "";
  let old_size = {
    'small': 'font-size: 10px',
    'large': 'font-size: 18px',
    'huge': 'font-size: 22px'
  };
  if (contentsString.value && contentsString.value !== "") {
    let delta = JSON.parse(contentsString.value.replaceAll("_regular", ""));
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
    modelValue = converter.convert();
  }
  return modelValue;
});
let imagePos = window.getImage(props.currentPos);
if (imagePos) {
  imagePos = "dist/images/" + imagePos;
}
const image = ref(imagePos.replaceAll(" ", "%20"))

const choiceNodeOption = ref(JSON.parse(window.getChoiceNodeOption(props.currentPos)))
let preset = ref<ChoiceNodeDesignPreset>(store.getNodePresets.get(choiceNodeOption.value['presetName'])!);
if (!preset.value) {
  store.errorLog.push("ChoiceNode: preset is not exist. (presetName: " + choiceNodeOption.presetName +
      " | pos: " + props.currentPos +
      " | name: " + window.getTitle(props.currentPos) + ")");
  preset.value = JSON.parse(window.getNodeDefaultPreset());
}

const imageMaxHeight = ref(preset.value['maximizingImage'] ? '80vh' : '50vh')
const title = ref(window.getTitle(props.currentPos))
const viewWidth = ref(window.getSize(props.currentPos))
const select = ref(window.getSelect(props.currentPos))
const choiceStatus = ref(window.getChoiceStatus(props.currentPos))
const choiceMode = ref(window.getChoiceNodeMode(props.currentPos))
const choiceMaximumStatus = ref(window.getMaximumStatus(props.currentPos))
const childLength = ref(window.childLength(props.currentPos))

const choiceNodeChild = ref(Array(childLength.value));
const paddingAround = computed(() => {
  return preset.value.paddingAround.map(function (element: number): string {
    return element + "px";
  }).join(" ");
});
const mainFont = ref(getFont(preset.value.mainFont))

const currentOutline = computed<OutlineOption>(() => {
  let defaultOutlineOption = preset.value.defaultOutlineOption;
  let selectOutlineOption = preset.value.selectOutlineOption;
  return (select.value > 0 && preset.value.selectOutlineEnable ? selectOutlineOption : defaultOutlineOption)!;
});

const currentColor = computed<ColorOption>(() => {
  let defaultColorOption = preset.value.defaultColorOption;
  let selectColorOption = preset.value.selectColorOption;
  return (select.value > 0 && preset.value.selectColorEnable ? selectColorOption : defaultColorOption)!;
});
const outlineStyle = computed(() => {
  return {
    "border-width": currentOutline.value.outlineWidth + "px",
    "border-color": getColor(currentOutline.value.outlineColor.color),
    "border-style": currentOutline.value.outlineType !== OutlineType.none ? currentOutline.value.outlineType : "",
    "padding": (currentOutline.value.outlinePadding + 2).toString() + "px",
    "border-radius": preset.value.roundEdge.map(function (element: number): string {
      return element + "px";
    }).join(" "),
  }
});
const cardStyle = computed(() => {
  let outputCss = getCssFromColorOption(currentColor.value);
  outputCss["border-radius"] = preset.value.roundEdge.map(function (element: number): string {
    return element + "px";
  }).join(" ");
  return outputCss;
});

const isHide = computed(() => choiceStatus.value.isHide);
const isOpen = computed(() => choiceStatus.value.isOpen);

const renderSelf = computed<boolean>(() => {
  if (props.renderChild !== ChoiceNodeChildRender.selected) {
    return true;
  }
  if (isHide.value || !isOpen.value) {
    return false;
  }
  return window.checkSelectedResult(props.currentPos);
});

const sliderThumbColor = computed(() => {
  return getColor(preset.value.sliderOption?.sliderThumbColor.color ?? 0);
});

const sliderThumbShape = computed(() => {
  if (preset.value.sliderOption?.sliderThumbShape === SliderThumbShape.circle) {
    return {
      'border-radius': '50%',
      'position': 'static',
      'width': '20px',
      'left': '0',
    };
  }
  return {
    'border-radius': '2px',
    'position': 'relative',
    'width': '10px',
    'left': '5px',
  };
});

const sliderTrackActiveColor = computed(() => {
  return getColor(preset.value.sliderOption?.sliderTrackActiveColor.color ?? 0);
});

const sliderTrackInactiveColor = computed(() => {
  return getColor(preset.value.sliderOption?.sliderTrackInactiveColor.color ?? 0);
});

function click() {
  if (props.clickable && choiceMode.value !== 'multiSelect') {
    window.select(props.currentPos, 0);
    needUpdate();
  }
}

function click_down() {
  if (props.clickable) {
    window.select(props.currentPos, select.value - 1);
    needUpdate();
  }
}

function click_up() {
  if (props.clickable) {
    window.select(props.currentPos, select.value + 1);
    needUpdate();
  }
}

function click_slider(number) {
  if (props.clickable) {
    window.select(props.currentPos, number);
    needUpdate();
  }
}

function updateChild() {
  let newContents = window.getContents(props.currentPos);
  if (contentsString.value !== newContents) {
    contentsString.value = newContents;
  }
  choiceStatus.value = window.getChoiceStatus(props.currentPos);
  select.value = window.getSelect(props.currentPos);

  if (wrapCustom.value) {
    wrapCustom.value.updateLayout();
    for (let i = 0; i < childLength.value; i++) {
      if (choiceNodeChild.value[i]) {
        choiceNodeChild.value[i].updateChild();
      }
    }
  }
}

function needUpdate() {
  let store = useStore();
  store.needUpdate();
}

defineExpose({updateChild})
</script>
<style scoped>
.slider::v-deep(.v-slider-thumb__surface){
  border-radius: v-bind('sliderThumbShape["border-radius"]');
  position: v-bind('sliderThumbShape["position"]');
  width: v-bind('sliderThumbShape["width"]');
  left: v-bind('sliderThumbShape["left"]');
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