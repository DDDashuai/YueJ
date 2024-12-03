import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('../views/ForgotPassword.vue')
  },
  {
    path: '/',
    component: () => import('../components/Layout.vue'),
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('../views/Home.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'chat',
        name: 'Chat',
        component: () => import('../views/Chat.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'health',
        name: 'Health',
        component: () => import('../views/Health.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'medicine',
        name: 'Medicine',
        component: () => import('../views/MedicineReminder.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('../views/Profile.vue'),
        meta: { requiresAuth: true }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 导航守卫
router.beforeEach(async (to, from, next) => {
  console.log('Route change:', { from: from.path, to: to.path })
  
  const userStore = useUserStore()
  
  if (to.meta.requiresAuth) {
    const isAuth = await userStore.checkAuth()
    if (!isAuth) {
      next('/login')
      return
    }
  }
  next()
})

// 添加后置守卫
router.afterEach((to, from) => {
  console.log('Route changed to:', to.path)
})

export default router 