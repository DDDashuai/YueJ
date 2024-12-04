import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'
import Login from '../views/Login.vue'
import Layout from '../components/Layout.vue'
import Home from '../views/Home.vue'
import Chat from '../views/Chat.vue'
import Health from '../views/Health.vue'
import MedicineReminder from '../views/MedicineReminder.vue'
import Profile from '../views/Profile.vue'
import Register from '../views/Register.vue'
import ForgotPassword from '../views/ForgotPassword.vue'

const routes = [
  {
    path: '/YueJ/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/YueJ/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/YueJ/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword
  },
  {
    path: '/YueJ/',
    component: Layout,
    redirect: '/YueJ/home',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: Home,
        meta: { requiresAuth: true }
      },
      {
        path: 'chat',
        name: 'Chat',
        component: Chat,
        meta: { requiresAuth: true }
      },
      {
        path: 'health',
        name: 'Health',
        component: Health,
        meta: { requiresAuth: true }
      },
      {
        path: 'medicine',
        name: 'Medicine',
        component: MedicineReminder,
        meta: { requiresAuth: true }
      },
      {
        path: 'profile',
        name: 'Profile',
        component: Profile,
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/YueJ/'
  }
]

const router = createRouter({
  history: createWebHistory('/YueJ/'),
  routes
})

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  
  if (to.meta.requiresAuth) {
    const isAuth = await userStore.checkAuth()
    if (!isAuth) {
      next('/YueJ/login')
      return
    }
  }
  next()
})

export default router 