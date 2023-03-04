<template>
  <div v-if="renderAsResult || imagePosition === 0">
    <div v-if="!hideTitle" class="title_color title_font">
      {{ title }}
    </div>
    <slot name="image"></slot>
    <slot name="contents"></slot>
  </div>

  <div v-else-if="imagePosition === 1">
    <div class="flex-default">
      <div class="flex-text">
        <slot name="contents"></slot>
      </div>
      <div class="flex-item">
        <slot name="image"></slot>
      </div>
    </div>
    <div v-if="!hideTitle" class="title_color title_font">
      {{ title }}
    </div>
  </div>

  <div v-else>
    <div class="flex-default">
      <div class="flex-item">
        <slot name="image"></slot>
      </div>
      <div class="flex-text">
        <slot name="contents"></slot>
      </div>
    </div>
    <div v-if="!hideTitle" class="title_color title_font">
      {{ title }}
    </div>
  </div>
</template>

<script>
export default {
  name: "ChoiceNodeContents",
  props: {
    imagePosition: Number,
    title: String,
    renderAsResult: Boolean,
    preset: Object
  },
  data() {
    let color = (this.preset.colorTitle ?? 0xFF000000).toString(16);
    color = '#' + color.substring(2) + color.substring(0, 2);
    return {
      titlePosition: this.preset.titlePosition,
      titleOutline: this.preset.titleOutline,
      colorTitle: color,
      hideTitle: this.preset.hideTitle,
    }
  }
}
</script>

<style scoped>
.flex-default {
  display: flex;
}

.flex-item {
  display: flex;
  align-items: center;
  width: 100%;
}

.flex-text{
  max-width: 60%;
}

.title_color {
  color: v-bind(colorTitle)
}

.title_font {
  font-family: v-bind(preset ['titleFont']);
  text-align: center;
  font-size: calc(8.75px + 0.33vw);
}
</style>