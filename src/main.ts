import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css'
import * as echarts from 'echarts';

import App from './App.vue'
import router from './router'


const app = createApp(App)

app.use(createPinia())
app.use(ElementPlus)
app.use(router)
app.config.globalProperties.$echarts = echarts

app.mount('#app')
