export default{
    install: (app: any) => {
        app.config.globalProperties.$getColor = (value: number, defaultColor: number) : String => {
            let color = (value ?? defaultColor).toString(16);
            color = '#' + color.substring(2) + color.substring(0, 2);
            return color;
        };
        app.config.globalProperties.$getLanguage = () : String => {
            return navigator.language ?? "en";
        };
    }
}

