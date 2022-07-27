import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Site from '@/components/Site'
import Ftp from '@/components/Ftp'
import Mysql from '@/components/Mysql'
import Soft from '@/components/Soft'
import Login from '@/components/Login'
import NotFound from '@/components/NotFound'

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/site',
      name: 'Site',
      component: Site,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/ftp',
      name: 'Ftp',
      component: Ftp,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/mysql',
      name: 'Mysql',
      component: Mysql,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/soft',
      name: 'Soft',
      component: Soft,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/404',
      name: 'NotFound',
      component: NotFound
    },
    { path: '*', redirect: '/404' }
  ]
});
