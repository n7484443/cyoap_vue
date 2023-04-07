<template>
    <v-card>
        <v-slide-group show-arrows class="scrolling">
            <v-slide-group-item v-for="n in list" :key="n">
                <v-card class="card" variant="outlined">
                    <div class="inner variable_font">
                        <strong>
                            <h4>
                                {{ n }}
                            </h4>
                        </strong>
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
.card {
    padding: 2px;
    margin: 2px;
}

.inner {
    display: flex;
    align-items: center; /* 수직 중앙 정렬 */
    justify-content: center; /* 수평 중앙 정렬 */
}

</style>