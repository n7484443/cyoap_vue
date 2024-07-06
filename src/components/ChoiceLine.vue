<template>
  <div v-if="!choiceStatus.isHide">
    <v-responsive min-height="100">
      <v-lazy v-model="isActive">
        <div class="item" :style="background">
          <div v-if="preset.alwaysVisibleLine">
            <v-divider thickness="5" length="100vw" class="line">
            </v-divider>
            <div v-if="lineOption.maxSelect !== -1" class="line_text">최대 {{ lineOption.maxSelect }}개만큼 선택 가능</div>
          </div>
          <WrapCustom ref="wrapCustom" :margin-vertical="marginVertical" :pos="currentPos"
                      :max-children-per-row="maxWidth"
                      :choice-line-alignment="alignment" v-slot="slotProps">
            <ChoiceNode :ref="'choiceNode.'+slotProps.index" :render-child=true :clickable="true"
                        :current-pos="slotProps.currentPos">
            </ChoiceNode>
          </WrapCustom>
        </div>
      </v-lazy>
    </v-responsive>
  </div>
</template>

<script lang="ts">
import ChoiceNode from "@/components/ChoiceNode.vue";
import {getCssFromColorOption, getCurrentMaxWidthScreen, useStore} from "@/fn_common";
import {ChoiceLineAlignment, choiceLineAlignmentToCSS, SizeData} from "@/preset/line_preset.js";
import WrapCustom from "@/components/WrapCustom.vue";

export default {
  components: {
    WrapCustom,
    ChoiceNode,
  },
  props: {
    pos: Number,
  },
  name: "LineSetting",
  data() {
    const store = useStore();
    let currentPos = [0, this.pos];
    let lineOption = JSON.parse(window.getLineOption(this.pos));
    let preset = store.getLinePresets.get(lineOption.presetName);
    if (!preset) {
      store.errorLog.push("Line: preset is not exist. (presetName: " + lineOption.presetName + " on pos " + this.currentPos + ")");
      preset = window.getLineDefaultPreset();
    }
    return {
      isActive: false,
      currentPos: currentPos,
      child: window.childLength(currentPos),
      choiceStatus: window.getChoiceStatus(currentPos),
      marginVertical: store.getPlatformDesign.marginVertical + 'px',
      preset: preset,
      background: getCssFromColorOption(preset!.backgroundColorOption),
      colorText: "#FFFFFFFF",
      lineOption: lineOption,
      maxWidth: preset?.maxChildrenPerRow ?? 12,
      alignment: ChoiceLineAlignment[preset?.alignment] ?? ChoiceLineAlignment.left,
      align: choiceLineAlignmentToCSS(ChoiceLineAlignment[preset?.alignment] ?? ChoiceLineAlignment.left)
    }
  },
  methods: {
    updateChild() {
      this.choiceStatus = window.getChoiceStatus(this.currentPos);
      for (let i = 0; i < this.child; i++) {
        if (this.$refs['choiceNode.' + i]) {
          this.$refs['choiceNode.' + i].updateChild();
        }
      }
      if (this.$refs.wrapCustom) {
        this.$refs.wrapCustom.updateLayout();
      }
    },
    needUpdate() {
      let store = useStore();
      store.needUpdate();
    },
  }
}
</script>

<style scoped>
.item {
  padding: v-bind(marginVertical) 0px;
}

.horizontal {
  display: grid;
  grid-template-columns: repeat(v-bind(maxFlex), 1fr);
  column-gap: 8px;
  row-gap: v-bind(marginVertical);
  grid-auto-flow: row;
  padding: 4px 0px;
}

.wrapper {
  display: grid;
  grid-template-columns: repeat(v-bind(maxWidth), 1fr);
  column-gap: 8px;
  row-gap: v-bind(marginVertical);
  grid-auto-flow: row;
  padding: 4px 0px;
}

.line_text {
  color: v-bind(colorText);
  text-align: center;
  font-weight: bold;
}

</style>