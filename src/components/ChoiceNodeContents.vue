<template>
  <slot name="title"></slot>
  <div v-if="imagePosition == 0">
    <!-- 2 1 1 -->
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
</template>

<script>
export default {
  name: "ChoiceNodeContents",
  props: {
    imagePosition: Number,
    maximizingImage: Boolean,
    image: String,
  }
}
</script>

<style scoped>
.flex-default {
  display: flex;
}
</style>