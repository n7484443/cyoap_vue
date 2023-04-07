<template>
    <div class="padding">
        <div class="wrapper">
            <div v-for="n in posList" :key="n">
                <ChoiceNode :current-pos="n" :clickable="false" :render-child="false"></ChoiceNode>
            </div>
        </div>
    </div>
</template>

<script>
import ChoiceNode from "@/components/ChoiceNode.vue";
import {useStore} from "@/fn_common";

export default {
    name: "SelectedResult",
    components: {
        ChoiceNode
    },
    data() {
        const store = useStore();
        let platformDesign = store.getPlatformDesign;
        let color = (platformDesign.backgroundColor ?? 0xFFFFFFFF).toString(16);
        color = '#' + color.substring(2);
        return {
            posList: JSON.parse(window.getSelectedPos()).map((n) => n['pos']),
            backgroundColor: color,
            resultSize: store.isSmallDisplay,
        }
    },
    computed: {
        maxWidth() {
            if(!useStore().isSmallDisplay){
                return this.resultSize ? 4 : 6;
            }
            return this.resultSize ? 2 : 4;
        },
        minWidth(){
            return this.resultSize ? "" : "800px";
        }
    },
    methods: {
        changeResultSize(){
            this.resultSize = !this.resultSize;
        }
    }
}
</script>

<style scoped>
.padding {
    padding: 3px;
    background-color: v-bind(backgroundColor);
    min-width: v-bind(minWidth);
}

.wrapper {
    display: grid;
    grid-template-columns: repeat(v-bind(maxWidth), 1fr);
    grid-template-rows: repeat(auto-fill, min-content);
    column-gap: 8px;
    row-gap: 8px;
    grid-auto-flow: row;
}
</style>