import {defineStore} from 'pinia';

export const textFontList = {
    google: {
        "jua": {families: ['Jua']},
        "notoSans": {families: ['Noto Sans KR']},
        "notoSerif": {families: ['Noto Serif KR']},
        "나눔고딕": {families: ['Nanum Gothic']},
        "나눔손글씨 붓": {families: ["Nanum Brush Script"]},
        "나눔손글씨 펜": {families: ["Nanum Pen Script"]},
        "Poor Story": {families: ["Poor Story"]},
        "East Sea Dokdo": {families: ["East Sea Dokdo"]},
        "Black Han Sans": {families: ["Black Han Sans"]},
        "Black And White Picture": {families: ["Black And White Picture"]},
        "IBM Plex Sans KR": {families: ["IBM Plex Sans KR"]}
    },
    custom: {
        "Neo 둥근모": {families: ['NeoDunggeunmo']},
    }
};

export default {
    install: (app: any) => {
        app.config.globalProperties.$getColor = (value: number, defaultColor: number): string => {
            let color = (value ?? defaultColor).toString(16);
            color = '#' + color.substring(2) + color.substring(0, 2);
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
            for(let key in textFontList){
                // @ts-ignore
                let fontObject = textFontList[key][font];
                if(fontObject){
                    return fontObject["families"];
                }
            }
            return "Noto Sans KR";
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
        platformDesign: {},
        nodePresets: new Map<string, object>(),
        linePresets: new Map<string, object>(),
        isSmallDisplay: false,
        errorLog: [] as string[],
    }),
    actions: {
        setPlatformDesign(platformDesign: object): void {
            this.platformDesign = platformDesign;
        },
        setNodePresets(presetList: { name: string }[]) {
            for (let preset of presetList) {
                this.nodePresets.set(preset.name, preset);
            }
        },
        setLinePresets(presetList: { name: string }[]) {
            for (let preset of presetList) {
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
        getPlatformDesign(state): object {
            return state.platformDesign;
        },
        getNodePresets(state): Map<string, object> {
            return state.nodePresets;
        },
        getLinePresets(state): Map<string, object> {
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