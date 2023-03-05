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