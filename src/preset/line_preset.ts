import {ColorOption} from "@/preset/node_preset";

export interface ChoiceLineDesignPreset{
    name:string;
    backgroundColorOption:ColorOption;
    backgroundImageString:string|null;
    alwaysVisibleLine:string;
}