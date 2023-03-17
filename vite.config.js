import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    base: '',

    server: {
        proxy: {
            '/dist': {
                target: 'https://interactiveweb.neocities.org/',
                changeOrigin: true,
                secure: false,
            }
        }
    },

    pluginOptions: {
        vuetify: {
            // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
        }
    },
    plugins: [vue()]
})
