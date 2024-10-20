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