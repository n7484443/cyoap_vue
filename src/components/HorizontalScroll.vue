<template>
  <div class="scrolling-wrapper">
    <div class="card" v-for="n in list" :key="n">
      <v-card>
        <div class="inner variable_font">
          <h2>
            {{ n }}
          </h2>
        </div>
      </v-card>
    </div>
  </div>
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
.scrolling-wrapper {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.scrolling-wrapper::-webkit-scrollbar {
  width: 10px;
}

.scrolling-wrapper::-webkit-scrollbar-thumb {
  background-color: #2f3542;
  border-radius: 10px;
}

.scrolling-wrapper::-webkit-scrollbar-track {
  background-color: grey;
}

.card{
  padding: 10px;
}
.inner{
  padding: 4px;
}
</style>