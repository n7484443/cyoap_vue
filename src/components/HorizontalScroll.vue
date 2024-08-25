<template>
  <v-card>
    <v-slide-group show-arrows class="scrolling">
      <v-slide-group-item v-for="n in list" :key="n">
        <v-chip variant="outlined" rounded="lg" class="ma-1 pa-2">
          <div class="inner variable_font">
            {{ n }}
          </div>
        </v-chip>
      </v-slide-group-item>
    </v-slide-group>
  </v-card>
</template>

<script setup lang="ts">
import {useStore, getFont} from "@/fn_common";
import {ref} from 'vue'

const store = useStore();
const list = ref(window.getValueList());
const font = ref(getFont(store.getPlatformDesign['variableFont']));

function updateList() {
  list.value = window.getValueList();
}

defineExpose({updateList})
</script>

<style scoped>

.inner {
  display: flex;
  align-items: center; /* 수직 중앙 정렬 */
  justify-content: center; /* 수평 중앙 정렬 */
}

.variable_font {
  font-family: v-bind(font);
}
</style>