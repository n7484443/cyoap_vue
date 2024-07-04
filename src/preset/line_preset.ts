import {ColorOption} from "@/preset/node_preset";
import {Pos} from "@/preset/default_types";

export enum ChoiceLineAlignment { left, center, right }

export function choiceLineAlignmentToCSS(alignment: ChoiceLineAlignment): string {
    switch (alignment) {
        case ChoiceLineAlignment.left:
            return "start";
        case ChoiceLineAlignment.center:
            return "center";
        case ChoiceLineAlignment.right:
            return "end";
    }

}

export interface ChoiceLineDesignPreset {
    name: string | null;
    backgroundColorOption: ColorOption | null;
    backgroundImageString: string | null;
    alwaysVisibleLine: string | null;
    alignment: ChoiceLineAlignment | null,
    maxChildrenPerRow: number | null
}

export interface SizeData{
    width: number;
    pos: null|Pos;
}