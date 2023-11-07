<template>
    <div v-if="choiceNodeOption['isOccupySpace'] && !visible" class="gridStyle"/>
    <div v-else-if="visible" class="gridStyle">
        <div id="outline_padding">
            <v-card :class="['card', {'outline': outline === '' && select > 0}]"
                    v-on:click="click"
                    :disabled="choiceStatus === 'closed'" :elevation="preset.elevation"
                    :color="colorCurrent">
                <div class="container padding">
                    <ChoiceNodeContents :imagePosition="preset['imagePosition']" :title="title"
                                        :renderAsResult="!renderChild"
                                        :preset="preset">
                        <template v-slot:contents>
                            <p v-html="contentsHtml" class="container content_font"></p>
                        </template>
                        <template v-slot:image>
                            <v-img v-if="renderChild" :src="image" :max-height="imageMaxHeight" class="rounded-xl">
                                <template v-slot:placeholder>
                                    <v-row class="fill-height ma-0" align="center" justify="center">
                                        <v-progress-circular indeterminate color="primary"/>
                                    </v-row>
                                </template>
                            </v-img>
                            <img v-else :src="image" class="image-result"/>
                        </template>
                    </ChoiceNodeContents>
                    <div v-if="choiceMode === 'multiSelect'">
                        <div v-if="choiceNodeOption.showAsSlider" class="multi-select-slider">
                            <v-slider :min="0" :max="choiceMaximumStatus" :step="1" thumb-label
                                      v-on:update:model-value="click_slider"
                                      :model-value="select"></v-slider>
                            <p class="text-center">{{ select }}</p>
                        </div>
                        <div v-else class="multi-select">
                            <v-btn v-on:click="click_down" variant="tonal">
                                <v-icon icon="mdi:mdi-chevron-left"/>
                            </v-btn>
                            <p class="text-center">
                                {{ select }}
                            </p>
                            <v-btn v-on:click="click_up" variant="tonal">
                                <v-icon icon="mdi:mdi-chevron-right"/>
                            </v-btn>
                        </div>
                    </div>
                    <div class="wrapper" v-if="childLength > 0 && renderChild">
                        <ChoiceNode class="item" v-for="(n, i) in childLength" ref="choiceNodeChild" :key="n"
                                    :currentPos="[...currentPos, i]" :render-child="renderChild" :clickable="clickable"
                                    @needUpdate="needUpdate">
                        </ChoiceNode>
                    </div>
                </div>
            </v-card>
        </div>
    </div>

</template>

<script>
import {QuillDeltaToHtmlConverter} from "quill-delta-to-html";
import ChoiceNodeContents from "@/components/ChoiceNodeContents.vue";
import {useStore} from "@/fn_common";

export default {
    props: {
        currentPos: Array,
        renderChild: Boolean,
        clickable: Boolean,
    },
    components: {
        ChoiceNodeContents
    },
    name: "ChoiceNode",
    data() {
        const store = useStore();
        let contentsString = window.getContents(this.currentPos);
        let contentsHtml = this.htmlFromQuill(contentsString);
        let imagePos = window.getImage(this.currentPos);
        if (imagePos) {
            imagePos = "dist/images/" + imagePos;
        }

        let choiceNodeOption = JSON.parse(window.getChoiceNodeOption(this.currentPos));
        let preset = store.getNodePresets.get(choiceNodeOption['presetName']);
        if (!preset) {
            store.errorLog.push("ChoiceNode: preset is not exist. (presetName: " + choiceNodeOption.presetName +
                " | pos: " + this.currentPos +
                " | name: " + window.getTitle(this.currentPos) + ")");
            preset = JSON.parse(window.getNodeDefaultPreset());
        }
        let select = window.getSelect(this.currentPos)
        let colorBase = this.$getColor(preset.colorNode, 0xFFFFFFFF);
        let colorOutline = this.$getColor(preset.outlineOption.outlineSelectColor, 0xFF40C4FF);
        let colorSelect = this.$getColor(preset.selectColorOption.selectColor, 0xFF40C4FF);
        let colorCurrent = select > 0 && preset.selectColorOption.enable ? colorSelect : colorBase;

        let choiceStatus = window.getChoiceStatus(this.currentPos);
        let choiceMode = window.getChoiceNodeMode(this.currentPos);
        let gridColumn = window.getSize(this.currentPos);

        let visible = choiceStatus !== 'hide' && choiceMode !== 'onlyCode';

        let outline = "";
        if (preset.outlineOption.outlineType !== "none") {
            outline = `${preset.outlineOption.outlineWidth}px ${preset.outlineOption.outlineType} ${select > 0 ? colorOutline : colorBase}`;
        }
        return {
            image: imagePos.replaceAll(" ", "%20"),
            imageMaxHeight: preset['maximizingImage'] ? '80vh' : '50vh',
            title: window.getTitle(this.currentPos),
            contentsHtml: contentsHtml,
            contentsString: contentsString,
            originalWidth: gridColumn,
            viewWidth: Math.min(gridColumn, store.getCurrentMaxWidth),
            select: select,
            choiceStatus: choiceStatus,
            choiceMode: choiceMode,
            choiceMaximumStatus: window.getMaximumStatus(this.currentPos),
            childLength: window.childLength(this.currentPos),
            choiceNodeOption: choiceNodeOption,
            colorBase: colorBase,
            colorCurrent: colorCurrent,
            colorOutline: colorOutline,
            colorSelect: colorSelect,
            visible: visible,
            preset: preset,
            round: preset.round + "px",
            padding: preset.padding + "px",
            outline: outline,
            outlinePadding: (preset.outlineOption.outlinePadding + 2) + "px",
            mainFont: this.$getFont(preset['mainFont'])
        }
    },
    methods: {
        htmlFromQuill(data) {
            let modalValue = "";
            if (data && data !== "") {
                let delta = JSON.parse(data);
                let converter = new QuillDeltaToHtmlConverter(delta, {
                    inlineStyles: {
                        size: {
                            'small': 'font-size: 0.77rem',
                            'large': 'font-size: 1.38rem',
                            'huge': 'font-size: 1.69rem'
                        },
                    }
                });
                modalValue = converter.convert();
            }
            return modalValue;
        },
        click() {
            if (this.clickable) {
                window.select(this.currentPos, 0);
                window.updatePlatform();
                this.needUpdate();
            }
        },
        click_down() {
            if (this.clickable) {
                window.select(this.currentPos, -1);
                window.updatePlatform();
                this.needUpdate();
            }
        },
        click_up() {
            if (this.clickable) {
                window.select(this.currentPos, 1);
                window.updatePlatform();
                this.needUpdate();
            }
        },
        click_slider(number) {
            if (this.clickable) {
                window.select(this.currentPos, number - this.select);
                window.updatePlatform();
                this.needUpdate();
            }
        },
        updateChild() {
            const store = useStore();
            let newContents = window.getContents(this.currentPos);
            if (this.contentsString !== newContents) {
                this.contentsString = newContents;
                this.contentsHtml = this.htmlFromQuill(newContents);
            }
            this.select = window.getSelect(this.currentPos);
            this.choiceStatus = window.getChoiceStatus(this.currentPos);
            this.visible = this.choiceStatus !== 'hide' && this.choiceMode !== 'onlyCode';
            this.viewWidth = Math.min(this.originalWidth, store.getCurrentMaxWidth);

            if (this.preset.outlineOption.outlineType !== "none") {
                this.outline = `${this.preset.outlineOption.outlineWidth}px ${this.preset.outlineOption.outlineType} ${this.select > 0 ? this.colorOutline : this.colorBase}`;
            }
            this.colorCurrent = this.select > 0 && this.preset.selectColorOption.enable ? this.colorSelect : this.colorBase;
            if (this.$refs.choiceNodeChild) {
                this.$refs.choiceNodeChild.forEach(function (i) {
                    if (i) {
                        i.updateChild();
                    }
                });
            }
        },
        needUpdate() {
            this.$emit('needUpdate',);
        }
    }
}
</script>
<style scoped>

.gridStyle {
    grid-column: auto / span v-bind(viewWidth);
}

.card {
    background-color: v-bind(colorCurrent);
    height: 100%;
    border-radius: v-bind(round);
}

#outline_padding {
    width: 100%;
    height: 100%;
    border-radius: v-bind(round);
    border: v-bind(outline);
    padding: v-bind(outlinePadding);
}

.outline {
    outline-color: v-bind(colorOutline);
    outline-style: solid;
}

/* Add some padding inside the card container */
.container {
    padding: 4px;
}

.wrapper {
    display: grid;
    grid-template-columns: repeat(v-bind(viewWidth), 1fr);
    grid-template-rows: repeat(auto-fill, min-content);
    column-gap: 8px;
    row-gap: 8px;
    grid-auto-flow: row;
}

.multi-select {
    display: flex;
    justify-content: space-around;
    margin-bottom: 8px;
    align-items: center
}

.multi-select-slider {
    display: flex;
    justify-content: center;
    margin-bottom: 8px;
    align-items: stretch;
    flex-direction: column;
}

.padding {
    padding: v-bind(padding);
}

.image-result {
    max-height: v-bind(imageMaxHeight);
    object-fit: contain;
    width: 100%;
}

.content_font {
    font-family: v-bind(mainFont);
}

</style>