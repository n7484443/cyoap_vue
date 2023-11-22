import {ChoiceNodeDesignPreset, ColorOption} from "@/preset/node_preset";
import {ChoiceLineDesignPreset} from "@/preset/line_preset";

export enum ImageAttribute {
    fit = "fit",
    fill = "fill",
    pattern = "pattern",
    stretch = "stretch"
}

export interface PlatformDesignSetting{
    variableFont:string;
    backgroundImage:string|null;
    backgroundColorOption:ColorOption;
    backgroundAttribute:ImageAttribute;
    choiceLinePresetList:ChoiceLineDesignPreset[];
    choiceNodePresetList:ChoiceNodeDesignPreset[];
    marginVertical:number;
}