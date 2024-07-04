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
    name: string | null;
    titlePosition: boolean | null;
    elevation: number | null;
    roundEdge: number[] | null;
    paddingAround: number[] | null;
    maximizingImage: boolean | null; //true: 80%, false: 50%
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
}