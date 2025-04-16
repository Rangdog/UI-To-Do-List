import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './store'
import Toast ,{POSITION} from "vue-toastification";
import type { PluginOptions } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

import './assets/main.css'

const app = createApp(App)
const options: PluginOptions = {
    position: POSITION.TOP_RIGHT,
    timeout: 3000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: 'button',
    icon: true,
    rtl: false
};
app.use(router)
app.use(pinia)
app.use(Toast, options)
app.mount('#app')
