<template>
  <div v-if="imagePosition === 0">
    <div v-if="!hideTitle" class="title_color title_font">
      {{ title }}
    </div>
    <v-img :src="image" :max-height="maximizingImage ? '80vh' : '50vh'"></v-img>
    <slot name="contents"></slot>
  </div>

  <div v-else-if="imagePosition === 1" class="flex-default">
    <div class="flex-default">
      <v-img :src="image" :max-height="maximizingImage ? '80vh' : '50vh'"></v-img>
      <slot name="contents"></slot>
    </div>
    <div v-if="!hideTitle" class="title_color title_font">
      {{ title }}
    </div>
  </div>

  <div v-else>
    <div class="flex-default">
      <slot name="contents"></slot>
      <v-img :src="image" :max-height="maximizingImage ? '80vh' : '50vh'"></v-img>
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
    maximizingImage: Boolean,
    hideTitle: Boolean,
    image: String,
    title: String,
  },
  data() {
    let platformDesign = this.$store.getters.getPlatformDesign;
    let color = (platformDesign.colorTitle ?? 0xFF000000).toString(16);
    color = '#' + color.substring(2) + color.substring(0, 2);
    return {
      titlePosition: platformDesign.titlePosition,
      titleOutline: platformDesign.titleOutline,
      colorTitle: color,
    }
  }
}
</script>

<style scoped>
.flex-default {
  display: flex;
}

.title_color{
  color: v-bind(colorTitle)
}
</style>