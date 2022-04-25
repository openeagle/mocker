import { createRouter, createWebHistory } from 'vue-router'

export const routes = []

const router = createRouter({
  history: createWebHistory('/mocker/example'),
  routes: [{
    path: '/',
    component: () => import('./Page/home')
  }],
})

export default router
