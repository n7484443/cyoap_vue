export interface EdgeValue {
    top: number,
    right: number,
    bottom: number,
    left: number,
}

export interface VertexValue {
    topLeft: number,
    topRight: number,
    bottomLeft: number,
    bottomRight: number,
}

export enum OutlineType {
    none = "none",
    solid = "solid",
    dotted = "dotted",
    dashed = "dashed"
}

export interface OutlineOption {
    outlineType: OutlineType;
    outlineColor: ColorOption;
    round: VertexValue;
    distance: EdgeValue;
    outlineWidth: number;
}

export enum SliderThumbShape {
    circle = "circle",
    thinRectangle = "thinRectangle",
}

export interface SliderOption {
    sliderThumbColor: ColorOption;
    sliderTrackActiveColor: ColorOption;
    sliderTrackInactiveColor: ColorOption;
    sliderThumbShape: SliderThumbShape;
}


export interface ChoiceNodeDesignPreset {
    name: string | null;
    titlePosition: boolean | null;
    elevation: number | null;
    round: VertexValue | null;
    padding: EdgeValue | null;
    imageMaxHeightRatio: number | null; //기준 : vh
    hideTitle: boolean | null;
    imagePosition: number | null; //0:default, 1:image-right 2:image-left
    colorTitle: number | null;
    titleFont: string | null;
    mainFont: string | null;
    defaultOutlineOption: OutlineOption | null;
    selectOutlineEnable: boolean | null;
    selectOutlineOption: OutlineOption | null;
    defaultColorOption: ColorOption | null;
    selectColorEnable: boolean | null;
    selectColorOption: ColorOption | null;
    sliderOption: SliderOption | null;
}