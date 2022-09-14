import { createApp } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import App from './App.vue'

const app = createApp(App);
app.component('QuillEditor', QuillEditor);
app.mount('#app');
