// Styles
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'
import {mdi} from "vuetify/iconsets/mdi";

export default createVuetify({
    icons: {
        defaultSet: 'mdi',
        sets: {
            mdi,
        }
    },
})
