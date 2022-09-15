const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    productionSourceMap: false,

    devServer: {
        proxy: 'https://interactiveweb.neocities.org'
    },
})
