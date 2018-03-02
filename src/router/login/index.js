import index from './../../components/login/index.vue'
import login from './../../page/login/login/login.vue'

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
    }
  ]
}
