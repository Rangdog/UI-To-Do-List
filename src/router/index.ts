import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/auth/RegisterView.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/DashboardView.vue'),
      },
      {
        path: 'projects/:id',
        name: 'ProjectDetail',
        component: () => import('@/views/projects/ProjectDetailView.vue'),
      },
      {
        path: 'steps/:id',
        name: 'StepDetail',
        component: () => import('@/views/steps/StepDetailView.vue'),
      },
      {
        path: 'tasks/:id',
        name: 'TaskDetail',
        component: () => import('@/views/tasks/TaskDetailView.vue'),
      },
      {
        path: 'manage/projects/:id',
        name: 'ManageProject',
        component: () => import('@/views/manage/project.vue')
      },
      {
        path: 'manage/steps/:id',
        name: 'ManageStep',
        component: () => import('@/views/manage/step.vue')
      },
      {
        path: 'manage/tasks/:id',
        name: 'ManageTask',
        component: () => import('@/views/manage/task.vue')
      },
      {
        path: '/agile_scrum_board',
        name: 'AgileScrumBoard',
        component: () => import('@/views/agile/board.vue')
      }
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token')

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if ((to.path === '/login' || to.path === '/register') && isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
