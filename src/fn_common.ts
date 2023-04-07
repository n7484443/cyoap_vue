import {defineStore} from 'pinia';

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
        'summary': 'SUMMARIZE'
    },
    ko: {
        'save_as_image': '이미지로 저장',
        'close': '닫기',
        'summary': '결과창 보기'
    }
}

export const useStore = defineStore({
    id: 'store',
    state: () => ({
        platformDesign: {},
        nodePresets: new Map<string, object>(),
        linePresets: new Map<string, object>(),
        isSmallDisplay: false,
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
    },
})