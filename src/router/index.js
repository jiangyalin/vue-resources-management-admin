import Vue from 'vue'
import VueCookie from 'vue-cookie'
import Router from 'vue-router'
import login from './login'
import error from './../components/error/404.vue'
import platform from './platform' // 运营
import operator from './operator' // 业主

Vue.use(Router)
const router = new Router({
  routes: [
    login,
    {
      path: '*',
      component: error
    }
  ]
})

const userType = VueCookie.get('userType') || '' // 用户类型
const isOperateType = userType === '0' // 运营
const isOwnerType = userType === '1' // 业主
if (isOperateType) router.addRoutes(platform)
if (isOwnerType) router.addRoutes(operator)

// 判断登陆权限
router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    const userType = VueCookie.get('userType') || '' // 用户类型
    const user = VueCookie.get('userName') || '' // 用户名
    // 判断登陆
    if (user === '' || userType === '') {
      next({
        path: '/zh-cn/login/login/login'
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
