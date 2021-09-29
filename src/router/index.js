import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/HelloWorld'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/dice',
    name: 'Dice',
    component: () => import('../components/games/dice/Dice')
  },
  {
    path: '/mines',
    name: 'Mines',
    component: () => import('../components/games/mines/Mines')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
