import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import { auth } from '../db'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'Meet Magento PL 2020 - topic poll',
      metaTags: [
        {
          name: 'description',
          content: 'Interested topics for Meet Magento PL 2020, voting and call4papers'
        },
        {
          property: 'og:description',
          content: 'Interested topics for Meet Magento PL 2020, voting and call4papers'
        }
      ]
    }
  },
  {
    path: '/topic/:id',
    name: 'topic',
    component: () => import(/* webpackChunkName: "topic" */ '../views/Topic.vue'),
    props: true,
    meta: {
      title: 'Meet Magento PL 2020 - topic poll'
    }
  },
  {
    path: '/user/:id',
    name: 'user',
    component: () => import(/* webpackChunkName: "topic" */ '../views/User.vue'),
    meta: {
      requiresAuth: true,
      title: 'Meet Magento PL 2020 - topic poll'
    }
  },
  {
    path: '/admin',
    name: 'Admin dasboard',
    component: () => import(/* webpackChunkName: "topic" */ '../views/Admin.vue'),
    meta: {
      requiresAuth: true,
      title: 'Meet Magento PL 2020 - topic poll - dashboard'
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)
  const currentUser = auth.currentUser

  if (requiresAuth && !currentUser) {
    next({ path: '/', query: { redirect: to.fullPath } })
  } else if (!requiresAuth && !currentUser) {
    next()
  } else {
    next()
  }
})

const DEFAULT_TITLE = 'Meet Magento PL 2020 - topic poll'
router.afterEach((to, from) => {
  Vue.nextTick(() => {
    document.title = to.meta.title || DEFAULT_TITLE
  })
})

export default router
