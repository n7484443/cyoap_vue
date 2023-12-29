<template>
  <div v-if="choiceStatus !== 'hide'">
    <v-responsive min-height="100">
      <v-lazy v-model="isActive">
        <div class="item" :style="background">
          <div v-if="preset.alwaysVisibleLine">
            <v-divider thickness="5" length="100vw" class="line">
            </v-divider>
            <div v-if="lineOption.maxSelect !== -1" class="line_text">최대 {{ lineOption.maxSelect }}개만큼 선택 가능</div>
          </div>
          <div class="wrapper">
            <ChoiceNode v-for="(n, i) in child" ref="choiceNode" :key="n" :current-pos="[...currentPos, i]"
                        :render-child=true :clickable="true" @needUpdate="needUpdate">
            </ChoiceNode>
          </div>
        </div>
      </v-lazy>
    </v-responsive>
  </div>
</template>

<script lang="ts">
import ChoiceNode from "@/components/ChoiceNode.vue";
import {useStore} from "@/fn_common";
import {ChoiceLineDesignPreset} from "@/preset/line_preset.js";

export default {
  components: {
    ChoiceNode,
  },
  props: {
    pos: Number,
  },
  name: "LineSetting",
  data() {
    const store = useStore();
    let currentPos = [this.pos];
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
      background: this.$getCssFromColorOption(preset!.backgroundColorOption),
      colorText: "#FFFFFFFF",
      lineOption: lineOption,
      maxWidth: store.getCurrentMaxWidth,
    }
  },
  methods: {
    updateChild() {
      const store = useStore();
      this.maxWidth = store.getCurrentMaxWidth;
      this.choiceStatus = window.getChoiceStatus(this.currentPos);
      if (this.$refs.choiceNode) {
        this.$refs.choiceNode.forEach(function (i) {
          if (i) {
            i.updateChild();
          }
        });
      }
    },
    needUpdate() {
      this.$emit('needUpdate',);
    },
  }
}
</script>

<style scoped>
.item {
  padding: v-bind(marginVertical) 0px;
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