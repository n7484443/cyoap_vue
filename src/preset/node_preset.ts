export enum OutlineType {
    none = "none",
    solid = "solid",
    dotted = "dotted",
    dashed = "dashed"
}

export interface OutlineOption {
    outlineType: OutlineType;
    outlineColor: ColorOption;
    outlinePadding: number;
    outlineWidth: number;
}

export enum ColorType {
    solid = "solid",
    gradient = "gradient",
}

export enum GradientType {
    linear = "linear",
    radial = "radial",
    sweep = "sweep",
}

export interface GradientData {
    gradientPos: {
        $1: number;
        $2: number;
    };
    color: number;
}

export interface ColorOption {
    colorType: ColorType;
    color: number;
    gradientType: GradientType;
    gradientData: GradientData[];
}

export interface ChoiceNodeDesignPreset {
    name: string;
    titlePosition: boolean;
    elevation: number;
    roundEdge: number[];
    paddingAround: number[];
    maximizingImage: boolean; //true: 80%, false: 50%
    hideTitle: boolean;
    imagePosition: number; //0:default, 1:image-right 2:image-left
    colorTitle: number;
    titleFont: string;
    mainFont: string;
    defaultOutlineOption: OutlineOption;
    selectOutlineEnable: boolean;
    selectOutlineOption: OutlineOption;
    defaultColorOption: ColorOption;
    selectColorEnable: boolean;
    selectColorOption: ColorOption;
}