<template>
    <div v-if="choiceNodeOption['isOccupySpace'] && !visible" class="gridStyle"/>
    <div v-else-if="visible" class="gridStyle">
        <div class="maxHeight" :style="outlineStyle">
            <v-card class="maxHeight"
                    :style="cardStyle"
                    v-on:click="click"
                    :disabled="choiceStatus === 'closed'" :elevation="preset.elevation">
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

<script lang="ts">
import {QuillDeltaToHtmlConverter} from "quill-delta-to-html";
import ChoiceNodeContents from "@/components/ChoiceNodeContents.vue";
import {useStore} from "@/fn_common";
import {ColorOption, ColorType, GradientType, OutlineOption, OutlineType} from "@/node_preset.ts";

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
    computed: {
        currentOutline():OutlineOption {
            let defaultOutlineOption = this.preset.defaultOutlineOption;
            let selectOutlineOption = this.preset.selectOutlineOption;
            return this.select > 0 && this.preset.selectOutlineEnable ? selectOutlineOption : defaultOutlineOption;
        },
        currentColor():ColorOption {
            let defaultColorOption = this.preset.defaultColorOption;
            let selectColorOption = this.preset.selectColorOption;
            return this.select > 0 && this.preset.selectColorEnable ? selectColorOption : defaultColorOption;
        },
        outlineStyle() {//border 로 구현
            return {
                "border-width": this.currentOutline.outlineWidth + "px",
                "border-color": this.$getColor(this.currentOutline.outlineColor.color),
                "border-style": this.currentOutline.outlineType !== OutlineType.none ? this.currentOutline.outlineType : "",
                "padding": (this.currentOutline.outlinePadding + 2).toString() + "px",
                "round": this.preset.round + "px",
            }
        },
        cardStyle(){
            let outputCss = {
                "border-radius": this.preset.round.toString() + "px"
            };
            if(this.currentColor.colorType === ColorType.solid){
                outputCss["background-color"] = this.$getColor(this.currentColor.color);
                return outputCss;
            }
            let sx = this.currentColor.gradientData[0].gradientPos.$1;
            let sy = this.currentColor.gradientData[0].gradientPos.$2;
            let ex = this.currentColor.gradientData[1].gradientPos.$1;
            let ey = this.currentColor.gradientData[1].gradientPos.$2;
            let startColor = this.$getColor(this.currentColor.gradientData[0].color);
            let endColor = this.$getColor(this.currentColor.gradientData[1].color);
            let width = Math.abs(ex - sx);
            let height = Math.abs(ey - sy);
            let angle = Math.atan2(height * (ex - sx), width * (ey - sy)) * 180 / Math.PI;
            switch(this.currentColor.gradientType){
                case GradientType.linear:
                    angle += 90;
                    outputCss["background"] = `linear-gradient(${angle}deg, ${startColor}, ${endColor})`;
                    break;
                case GradientType.radial:
                    outputCss["background"] = `radial-gradient(circle at ${sx * 100.0}% ${sy * 100.0}%, ${startColor}, ${endColor})`;
                    break;
                case GradientType.sweep:
                    outputCss["background"] = `conic-gradient(from ${angle - 90}deg at ${sx * 100.0}% ${sy * 100.0}%, ${startColor}, ${endColor}, ${startColor})`;
                    console.log(outputCss["background"]);
                    break;
            }
            return outputCss;
        }
    },
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

        let choiceStatus = window.getChoiceStatus(this.currentPos);
        let choiceMode = window.getChoiceNodeMode(this.currentPos);
        let gridColumn = window.getSize(this.currentPos);

        let visible = choiceStatus !== 'hide' && choiceMode !== 'onlyCode';

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
            visible: visible,
            preset: preset,
            padding: preset.padding + "px",
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

.maxHeight {
    height: 100%;
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