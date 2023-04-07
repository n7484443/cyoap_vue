<template>
  <details v-if="errorLog.length !== 0">
      <summary>Error Log
      </summary>
      <div v-for="n in errorLog" :key="n">
          <h5> {{n}} </h5>
      </div>
  </details>
</template>

<script>
import {useStore} from "@/fn_common";

export default {
    name: "ErrorLog",
    computed: {
        errorLog() {
            return useStore().getErrorLog;
        }
    },
}
</script>

<style scoped>

</style>