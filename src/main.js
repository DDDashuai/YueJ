import './assets/favicon.js'
import './assets/styles/index.css'
import 'vant/lib/index.css'

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from '@/App.vue';
import router from '@/router';

// 引入Vant组件
import {
  Button,
  Form,
  Field,
  CellGroup,
  NavBar,
  Tabbar,
  TabbarItem,
  Icon,
  Image as VanImage,
  Loading,
  Cell,
  Badge,
  Empty,
  List,
  PullRefresh,
  Dialog,
  Toast,
  Popup,
  DatePicker,
  TimePicker,
  Steps,
  Step,
  Checkbox,
  CheckboxGroup,
  Uploader,
  Tab,
  Tabs,
  DropdownMenu,
  DropdownItem,
} from 'vant';

const baseUrl = window.__VITE_BASE_URL__ || '/YueJ/';
window.__dynamic_base__ = baseUrl;

const app = createApp(App);

// 注册Pinia
const pinia = createPinia();
app.use(pinia);

// 注册路由
app.use(router);

// 注册Vant组件
const vantComponents = [
  Button,
  Form,
  Field,
  CellGroup,
  NavBar,
  Tabbar,
  TabbarItem,
  Icon,
  VanImage,
  Loading,
  Cell,
  Badge,
  Empty,
  List,
  PullRefresh,
  Dialog,
  Toast,
  Popup,
  DatePicker,
  TimePicker,
  Steps,
  Step,
  Checkbox,
  CheckboxGroup,
  Uploader,
  Tab,
  Tabs,
  DropdownMenu,
  DropdownItem,
];

vantComponents.forEach(component => {
  app.component(component.name, component);
});

app.mount('#app');