import {defineStore} from 'pinia';
import {PlatformDesignSetting} from "@/preset/design_setting";
import {ChoiceLineDesignPreset} from "@/preset/line_preset";
import {ChoiceNodeDesignPreset, ColorOption, ColorType, GradientType} from "@/preset/node_preset";

export const textFontList:{[key:string] : string} = {
    "jua": 'Jua',
    "notoSans": 'Noto Sans KR',
    "notoSerif": 'Noto Serif KR',
    "나눔고딕": 'Nanum Gothic',
    "나눔손글씨 붓": "Nanum Brush Script",
    "나눔손글씨 펜": "Nanum Pen Script",
    "Poor Story": "Poor Story",
    "East Sea Dokdo": "East Sea Dokdo",
    "Black Han Sans": "Black Han Sans",
    "Black And White Picture": "Black And White Picture",
    "IBM Plex Sans KR": "IBM Plex Sans KR",
    "Neo 둥근모": 'NeoDunggeunmo',
};

export default {
    install: (app: any) => {
        app.config.globalProperties.$getColor = (value: number, defaultColor?: number): string => {
            let color = (value ?? defaultColor ?? 0xFF40C4FF).toString(16);
            if (color.length == 6) {
                color = "00" + color;
            }
            color = '#' + color.substring(2) + color.substring(0, 2);
            // console.log(color)
            return color;
        };
        app.config.globalProperties.$getTranslation = (input: string): string => {
            let language: string = navigator.language ?? "en";
            language = language.substring(0, 2).toLowerCase();
            if (!translation[language]) {
                language = "en";
            }
            return translation[language][input];
        };
        app.config.globalProperties.$getFont = (font: string): string => {
            if (font === "default") {
                font = "notoSans";
            }
            if(font in textFontList){
                return textFontList[font];
            }
            for(let key in textFontList){
                let a = textFontList[key].replaceAll(" ", "").toLowerCase();
                let b = font.replaceAll(" ", "").toLowerCase()
                if(a.includes(b)){
                    return textFontList[key];
                }
            }
            console.error(font + " is not found in font list")
            return "Noto Sans KR";
        }
        app.config.globalProperties.$getCssFromColorOption = (colorOption: ColorOption): Object => {
            let outputCss: { [key: string]: string } = {};
            if (colorOption.colorType === ColorType.solid) {
                outputCss["background-color"] = app.config.globalProperties.$getColor(colorOption.color);
                return outputCss;
            }
            let sx = colorOption.gradientData[0].gradientPos.$1;
            let sy = colorOption.gradientData[0].gradientPos.$2;
            let ex = colorOption.gradientData[1].gradientPos.$1;
            let ey = colorOption.gradientData[1].gradientPos.$2;
            let startColor = app.config.globalProperties.$getColor(colorOption.gradientData[0].color);
            let endColor = app.config.globalProperties.$getColor(colorOption.gradientData[1].color);
            let width = Math.abs(ex - sx);
            let height = Math.abs(ey - sy);
            switch (colorOption.gradientType) {
                case GradientType.linear:
                    let angle = (-Math.atan2((ex - sx), (ey - sy)) / Math.PI * 180) + 180;
                    let sd = Math.sqrt((0.5 - sx)**2 + (0.5 - sy)**2);
                    let ed = Math.sqrt((0.5 - ex)**2 + (0.5 - ey)**2);
                    let se = Math.sqrt((ex - sx)**2 + (ey - sy)**2);
                    let sp = (sd**2 - ed ** 2 + se ** 2) / (2 * se);
                    let ep = se - sp;
                    let diagonal = Math.sqrt(2);
                    // let d = Math.sqrt(sd**2 - sp**2);
                    let ratio_s = (0.5 - sp / diagonal) * 100.0;
                    let ratio_e = ((0.5 + ep) / diagonal) * 100.0;
                    // let start_rotated = Math.sqrt(sx * sx + sy * sy) * width;
                    // let end_rotated = Math.sqrt(ex * ex + ey * ey) * width;
                    outputCss["background"] = `linear-gradient(${angle}deg, ${startColor} ${ratio_s}%, ${endColor} ${ratio_e}%)`;
                    break;
                case GradientType.radial:
                    outputCss["background"] = `radial-gradient(circle at ${sx * 100.0}% ${sy * 100.0}%, ${startColor} 0%, ${endColor} ${ex * 100.0}%`;
                    break;
                case GradientType.sweep:
                    outputCss["background"] = `conic-gradient(from ${90}deg at ${sx * 100.0}% ${sy * 100.0}%, ${startColor}, ${endColor}, ${startColor})`;
                    break;
            }
            return outputCss;
        }
    }
}

type translationType = {
    [key: string]: {
        [key: string]: string
    }
}

export const translation: translationType = {
    en: {
        'save_as_image': 'Save As Image',
        'close': 'Close',
        'summary': 'SUMMARIZE',
        'change_result_size': 'Change Result Size'
    },
    ko: {
        'save_as_image': '이미지로 저장',
        'close': '닫기',
        'summary': '결과창 보기',
        'change_result_size': '결과창 크기 변경'
    }
}

export const useStore = defineStore({
    id: 'store',
    state: () => ({
        platformDesign: null as PlatformDesignSetting | null,
        nodePresets: new Map<string, ChoiceNodeDesignPreset>(),
        linePresets: new Map<string, ChoiceLineDesignPreset>(),
        isSmallDisplay: false,
        errorLog: [] as string[],
    }),
    actions: {
        setPlatformDesign(platformDesign: PlatformDesignSetting): void {
            this.platformDesign = platformDesign;
            for (let preset of platformDesign.choiceNodePresetList) {
                this.nodePresets.set(preset.name, preset);
            }
            for (let preset of platformDesign.choiceLinePresetList) {
                this.linePresets.set(preset.name, preset);
            }
        },
        setSmallDisplay(size: number) {
            this.isSmallDisplay = size < 1000;
        },
        setErrorLog(error: string[]) {
            this.errorLog = error;
        }
    },
    getters: {
        getPlatformDesign(state): PlatformDesignSetting {
            return state.platformDesign!;
        },
        getNodePresets(state): Map<string, ChoiceNodeDesignPreset> {
            return state.nodePresets;
        },
        getLinePresets(state): Map<string, ChoiceLineDesignPreset> {
            return state.linePresets;
        },
        getCurrentMaxWidth(state): number {
            return state.isSmallDisplay ? 6 : 12;
        },
        getErrorLog(state): string[] {
            return state.errorLog;
        },
    },
})