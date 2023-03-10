<template>
  <v-card>
    <v-slide-group show-arrows class="scrolling">
      <v-slide-group-item v-for="n in list" :key="n">
        <v-card class="card" >
          <div class="inner variable_font">
            <h3>
              {{ n }}
            </h3>
          </div>
        </v-card>
      </v-slide-group-item>
    </v-slide-group>
  </v-card>
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
  max-width: 100%;
}

.card{
  padding: 6px;
}
.inner{
  padding: 4px;
}
</style>