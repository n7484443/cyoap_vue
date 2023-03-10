const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
    publicPath: './',
    transpileDependencies: true,
    productionSourceMap: false,

    devServer: {
        proxy: 'https://interactiveweb.neocities.org/'
    },

    pluginOptions: {
      vuetify: {
			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
		}
    }
})
