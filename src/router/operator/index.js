import home from './home'
import operateCenter from './operate-center'
import financialCenter from './financial-center'
import systemManagement from './system-management'
import error from './../../components/error/404.vue'

const operator = [
  {
    path: '/',
    redirect: '/zh-cn/home/home/home'
  },
  {
    path: '/:lang',
    redirect: '/:lang/home/home/home'
  },
  home,
  operateCenter,
  financialCenter,
  systemManagement,
  {
    path: '*',
    component: error
  }
]

export default operator
