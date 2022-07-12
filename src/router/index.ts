import { createWebHashHistory, createRouter } from 'vue-router'
import DashboardVue from '@/components/dashboard/Dashboard.vue'
import Expenses from '@/components/expenses/Expenses.vue'
import ExpenseSummary from '@/components/expenses/ExpenseSummary.vue'
import Categories from '@/components/categories/Categories.vue'
import Imports from '@/components/imports/Imports.vue'
import Login from '@/components/login/Login.vue'

const routes = [
  {
    path: '/',
    redirect: { name: 'Dashboard' },
    meta: { hidden: true },
  },
  {
    name: 'Login',
    path: '/login',
    meta: { hidden: true },
    component: Login,
  },
  {
    name: 'Dashboard',
    path: '/dashboard',
    component: DashboardVue,
    meta: { icon: 'mdi-home' },
  },
  {
    name: 'Categories',
    path: '/categories',
    meta: { icon: 'mdi-shape' },
    component: Categories,
  },
  {
    name: 'Manage Expenses',
    path: '/expenses',
    meta: { icon: 'mdi-credit-card-outline' },
    component: Expenses,
  },
  {
    name: 'Expense Summary',
    path: '/expenseSummary',
    meta: { icon: 'mdi-credit-card' },
    component: ExpenseSummary,
  },
  {
    name: 'Import Expenses',
    path: '/imports',
    meta: { icon: 'mdi-publish' },
    component: Imports,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export { routes as Routes }
export default router
