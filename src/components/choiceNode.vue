<template>
  <!-- v-card의 elevation을 4으로 -->
  <div class="card">
    <div class="container">
      <p v-html="modelValue"></p>
    </div>
  </div>
</template>

<script>
import {QuillDeltaToHtmlConverter} from "quill-delta-to-html";

export default {
  name: "choiceNode",
  data() {
    //ajax로 dist/lineSetting_0.json 파일 받아서 parse
    const url = "/dist/nodes/lineSetting_0.json";
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.send();
    const jsonObject = JSON.parse(xhr.responseText);
    let contentsAsString = jsonObject.children[0].contentsString;
    let delta = JSON.parse(contentsAsString);
    let converter = new QuillDeltaToHtmlConverter(delta, {});
    return {
      modelValue: converter.convert()
    }
  }
}
</script>
<style>
.card {
  /* Add shadows to create the "card" effect */
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  transition: 0.3s;
}

/* On mouse-over, add a deeper shadow */
.card:hover {
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
}

/* Add some padding inside the card container */
.container {
  padding: 2px 16px;
}
</style>