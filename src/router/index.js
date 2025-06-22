import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import SignupView from '@/views/SignupView.vue'
import ClassView from '@/views/ClassView.vue'
import ThemesView from '@/views/ThemesView.vue'
import SettingsView from '@/views/SettingsView.vue'
import ProfileView from '@/views/ProfileView.vue'
import PrivacyPolicyView from '@/views/PrivacyPolicyView.vue'
import TestsView from '@/views/TestsView.vue'
import TestView from '@/views/TestView.vue'

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
      path: '/klasy',
      name: 'class',
      component: ClassView,
    },
    {
      path: '/themenmix',
      name: 'themes',
      component: ThemesView,
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView,
    },
    {
      path: '/profil',
      name: 'profile',
      component: ProfileView,
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
    },
    {
      path: '/test/:level',
      name: 'test-detail',
      component: TestView,
      props: true,
    },
  ],
})

export default router
