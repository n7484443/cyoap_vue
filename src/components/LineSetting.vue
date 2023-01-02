<template>
  <div v-if="choiceStatus !== 'hide'">
    <v-responsive min-height="100">
      <v-lazy v-model="isActive">
        <div class="item">
          <div v-if="preset['alwaysVisibleLine']">
            <v-divider thickness="5" length="100vw" class="line" :color="colorLine">
            </v-divider>
            <div v-if="maxSelect != -1" class="line_text">최대 {{ maxSelect }}개만큼 선택 가능</div>
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

<script>
import ChoiceNode from "@/components/ChoiceNode";

export default {
  components: {
    ChoiceNode,
  },
  props: {
    pos: Number,
  },
  name: "LineSetting",
  data() {
    let currentPos = [this.pos];
    let presetName = window.getLinePresetName(this.pos);
    let preset = this.$store.getters.getLinePresets[presetName];
    let color = "#1fe0";
    let colorLine;
    let colorText;
    if(preset['background_color']){
      let colorBefore = (preset['background_color'] ?? 0xFFFFFFFF).toString(16);
      color = '#' + colorBefore.substring(2) + colorBefore.substring(0, 2);
    }
    if (color) {
      colorLine = "#000000";
      colorText = "#FFFFFF";
    }else if (this.getLuminance(color) > 0.5) {
      colorLine = "#FFFFFF";
      colorText = "#000000";
    }else{
      colorLine = "#000000";
      colorText = "#FFFFFF";
    }

    return {
      isActive: false,
      currentPos: currentPos,
      child: window.childLength(currentPos),
      choiceStatus: window.getChoiceStatus(currentPos),
      marginVertical: this.$store.getters.getPlatformDesign.marginVertical + 'px',
      colorBackground: color,
      preset: preset,
      colorLine: colorLine + "FF",
      colorText: colorText + "FF",
      maxSelect: window.getLineMaxSelect(this.pos)
    }
  },
  methods: {
    updateChild() {
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
    hexToRgb(hex) {
      let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.substring(0, 7));
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    },

    getLuminance(color) {
      let rgb = this.hexToRgb(color);
      return (0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b);
    }
  }
}
</script>

<style scoped>
.item {
  padding: v-bind(marginVertical) 0px;
  background-color: v-bind(colorBackground);
}

.wrapper {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(auto-fill, min-content);
  column-gap: 8px;
  row-gap: v-bind(marginVertical);
  grid-auto-flow: row;
  padding: 4px 0px;
}

.line_text{
  color: v-bind(colorText);
  text-align: center;
  font-weight: bold;
}

</style>