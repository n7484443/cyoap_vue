import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {fileURLToPath, URL} from "node:url";
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineConfig({
    base: '',

    server: {
        proxy: {
            '/dist': {
                target: 'https://interactiveweb.neocities.org/test',
                changeOrigin: true,
                secure: false,
            }
        }
    },
    plugins: [
        vue({
            template: { transformAssetUrls }
        }),
        // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
        vuetify({
            autoImport: true,
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
})
