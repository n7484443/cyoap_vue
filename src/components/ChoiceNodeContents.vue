<template>
    <div v-if="renderAsResult || imagePosition === 0">
        <div v-if="titlePosition">
            <div v-if="!hideTitle" class="title_color title_font">
                {{ title }}
            </div>
            <slot name="image"></slot>
            <slot name="contents"></slot>
        </div>
        <div v-else>
            <slot name="image"></slot>
            <div v-if="!hideTitle" class="title_color title_font">
                {{ title }}
            </div>
            <slot name="contents"></slot>
        </div>
    </div>

    <div v-else-if="imagePosition === 1">
        <div class="flex-default">
            <div class="flex-text">
                <slot name="contents"></slot>
            </div>
            <div class="flex-item">
                <slot name="image"></slot>
            </div>
        </div>
        <div v-if="!hideTitle" class="title_color title_font">
            {{ title }}
        </div>
    </div>

    <div v-else>
        <div class="flex-default">
            <div class="flex-item">
                <slot name="image"></slot>
            </div>
            <div class="flex-text">
                <slot name="contents"></slot>
            </div>
        </div>
        <div v-if="!hideTitle" class="title_color title_font">
            {{ title }}
        </div>
    </div>
</template>

<script>
import {getColor, getFont} from "@/fn_common";

export default {
    name: "ChoiceNodeContents",
    props: {
        imagePosition: Number,
        title: String,
        renderAsResult: Boolean,
        preset: Object
    },
    data() {
        let color = getColor(this.preset.colorTitle, 0xFF000000);
        return {
            titlePosition: this.preset.titlePosition,
            titleOutline: this.preset.titleOutline,
            colorTitle: color,
            hideTitle: this.preset.hideTitle,
            titleFont: getFont(this.preset['titleFont'])
        }
    }
}
</script>

<style scoped>
.flex-default {
    display: flex;
}

.flex-item {
    display: flex;
    align-items: center;
    width: 100%;
}

.flex-text {
    max-width: 60%;
}

.title_color {
    color: v-bind(colorTitle)
}

.title_font {
    font-family: v-bind(titleFont);
    text-align: center;
    font-size: 1.25rem;
}
</style>