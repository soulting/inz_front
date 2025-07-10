import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import SignupView from '@/views/SignupView.vue'
import ClassView from '@/views/ClassesStudentView.vue'
import ThemesView from '@/views/ThemesView.vue'
import SettingsView from '@/views/SettingsView.vue'
import ProfileView from '@/views/ProfileView.vue'
import PrivacyPolicyView from '@/views/PrivacyPolicyView.vue'
import TestsView from '@/views/TestsView.vue'
import TestView from '@/views/TestView.vue'
import { useAuthStore } from '@/stores/auth'
import ClassTeacher from '@/views/ClassesTeacherView.vue'
import CreateTaskView from '@/views/CreateTaskView.vue'
import CreateLessonView from '@/views/CreateLessonView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView,
    },
    {
      path: '/classes',
      name: 'class',
      component: ClassView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/classes-teacher',
      name: 'class-teacher',
      component: ClassTeacher,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/themenmix',
      name: 'themes',
      component: ThemesView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/profil',
      name: 'profile',
      component: ProfileView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/privacy-policy',
      name: 'privacy-policy',
      component: PrivacyPolicyView,
    },
    {
      path: '/test',
      name: 'test',
      component: TestsView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/test/:level',
      name: 'test-detail',
      component: TestView,
      props: true,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/create-task',
      name: 'create-task',
      component: CreateTaskView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/create-lesson',
      name: 'create-lesson',
      component: CreateLessonView,
      meta: {
        requiresAuth: true,
      },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  const requiresAuth = to.meta.requiresAuth

  if (requiresAuth && !authStore.jwtToken) {
    return next('/login')
  }

  if (to.fullPath === '/classes' && authStore.user?.role === 'teacher') {
    return next('/classes-teacher')
  }

  next()
})

export default router
