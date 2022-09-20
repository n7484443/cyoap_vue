<template>
  <div v-if="!titlePosition && !hideTitle" :class="['title_font', {titleOutline: titleOutline}]">
    {{ title }}
  </div>
  <div v-if="imagePosition == 0">
    <v-img :src="image" :max-height="maximizingImage ? '80vh' : '50vh'"></v-img>
    <slot name="contents"></slot>
  </div>
  <div v-else-if="imagePosition == 1" class="flex-default">
    <v-img :src="image" :max-height="maximizingImage ? '80vh' : '50vh'"></v-img>
    <slot name="contents"></slot>
  </div>
  <div v-else class="flex-default">
    <slot name="contents"></slot>
    <v-img :src="image" :max-height="maximizingImage ? '80vh' : '50vh'"></v-img>
  </div>
  <div v-if="titlePosition && !hideTitle" :class="['title_font', {titleOutline: titleOutline}]">
    {{ title }}
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
  data(){
    let platformDesign = this.$store.getters.getPlatformDesign;
    return {
      titlePosition: platformDesign.titlePosition,
      titleOutline: platformDesign.titleOutline
    }
  }
}
</script>

<style scoped>
.flex-default {
  display: flex;
}
.title_font_outline{
  text-shadow: -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 red, 1px 1px 0 white;
}
</style>