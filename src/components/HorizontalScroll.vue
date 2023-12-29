<template>
    <v-card>
        <v-slide-group show-arrows class="scrolling">
            <v-slide-group-item v-for="n in list" :key="n">
                <v-card class="card" variant="outlined">
                    <div class="inner variable_font">
                        <strong>
                            <h3>
                                {{ n }}
                            </h3>
                        </strong>
                    </div>
                </v-card>
            </v-slide-group-item>
        </v-slide-group>
    </v-card>
</template>

<script>

import {useStore} from "@/fn_common";
export default {
    name: "HorizontalScroll",
    data() {
        const store = useStore();
        return {
            list: window.getValueList(),
            font: this.$getFont(store.getPlatformDesign['variableFont'])
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

.variable_font {
    font-family: v-bind(font);
}
</style>