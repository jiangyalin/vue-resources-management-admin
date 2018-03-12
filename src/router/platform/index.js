import home from './home'
import book from './book'
import user from './user'
import error from './../../components/error/404.vue'

const platform = [
  {
    path: '/',
    redirect: '/zh-cn/home/home/home'
  },
  {
    path: '/:lang',
    redirect: '/:lang/home/home/home'
  },
  home,
  book,
  user,
  {
    path: '*',
    component: error
  }
]

export default platform
