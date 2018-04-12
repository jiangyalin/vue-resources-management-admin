import index from './../../components/login/index.vue'
import login from './../../page/login/login/login.vue'
import join from './../../page/login/join/join.vue'

export default {
  path: '/:lang/login',
  component: index,
  children: [
    {
      path: '',
      redirect: 'login/login'
    },
    {
      path: 'login',
      redirect: 'login/login'
    },
    {
      path: 'login/login',
      component: login
    },
    {
      path: 'join',
      redirect: 'join/join'
    },
    {
      path: 'join/join',
      component: join
    }
  ]
}
