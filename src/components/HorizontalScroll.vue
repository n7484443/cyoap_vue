<template>
  <v-slide-group show-arrows class="scrolling">
    <v-slide-group-item v-for="n in list" :key="n">
      <v-card class="card" >
        <div class="inner variable_font">
          <h2>
            {{ n }}
          </h2>
        </div>
      </v-card>
    </v-slide-group-item>
  </v-slide-group>
</template>

<script>

export default {
  name: "HorizontalScroll",
  data() {
    return {
      list: window.getValueList(),
    }
  },
  methods: {
    updateList() {
      this.list = window.getValueList();
    }
  }
}
</script>

<style scoped>
.scrolling {
  max-width: 100vw;
}

.card{
  padding: 10px;
}
.inner{
  padding: 4px;
}
</style>