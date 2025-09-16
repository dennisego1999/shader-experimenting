import { createApp } from 'vue';
import './styles/app.css';
import router from './ts/Router';
import App from './ts/Layouts/AppLayout.vue';

// Create vue app
const app = createApp(App);

// Use plugins and mount to container
app.use(router).mount('#app');
