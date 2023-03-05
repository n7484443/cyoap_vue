const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
    publicPath: './',
    transpileDependencies: true,
    productionSourceMap: false,

    devServer: {
        proxy: 'https://dragonswhore-cyoas.neocities.org/cyoap/'
    },

    pluginOptions: {
      vuetify: {
			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
		}
    }
})
