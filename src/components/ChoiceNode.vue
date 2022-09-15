<template>
  <!-- v-card의 elevation을 4으로 -->
  <div :class="[selectable ? (selected ? 'card-outline' : 'card') : 'card-disable']" :id="currentPos" v-on:click="click">
    <div class="container">
      <img class="image" :src="image" />
      <div class="container">
        <p v-html="modelValue"></p>
      </div>
    </div>
  </div>
</template>

<script>
import {QuillDeltaToHtmlConverter} from "quill-delta-to-html";

export default {
  props: {
    pos : Number,
    beforePos : Array,
  },
  name: "ChoiceNode",
  data() {
    this.currentPos = [...this.beforePos, this.pos];
    let data = window.getContents(this.currentPos);
    if(!data){
      return {
        image: "",
        modelValue: "",
        currentPos: Array,
        gridColumn: 1,
        selectable: false,
        selected: false,
      }
    }
    let delta = JSON.parse(data);
    let converter = new QuillDeltaToHtmlConverter(delta, {});
    let imagePos = window.getImage(this.currentPos);
    if(imagePos){
      imagePos = "dist/images/" + imagePos;
    }
    return {
      image: imagePos,
      modelValue: converter.convert(),
      currentPos: Array,
      gridColumn: window.getSize(this.currentPos),
      selectable: window.isSelectable(this.currentPos),
      selected: false,
    }
  },
  methods: {
    click: function(){
      if(this.selectable){
        this.selected = !this.selected;
        window.select(this.currentPos);
      }
    }
  }
}
</script>
<style scoped>
.card {
  /* Add shadows to create the "card" effect */
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  transition: 0.3s;
  grid-column: auto / span v-bind(gridColumn);
}

.card-disable {
   /* Add shadows to create the "card" effect */
   box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
   transition: 0.3s;
   grid-column: auto / span v-bind(gridColumn);
   color: #e0e0e0;
}
.card-outline {
  /* Add shadows to create the "card" effect */
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  transition: 0.3s;
  grid-column: auto / span v-bind(gridColumn);
  outline-color: #fe9616;
  outline-style: solid;
}


/* On mouse-over, add a deeper shadow */
.card:hover {
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
}

/* Add some padding inside the card container */
.container {
  padding: 4px;
}
.image{
  max-width: 100%;
  height: auto;
  object-fit: fill;
  object-position: 50% 50%;
  margin: auto;
  display: block;
}
</style>