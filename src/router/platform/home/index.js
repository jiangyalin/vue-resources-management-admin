import index from '../../../components/public/main/index.vue'
import home from './home'

let children = [
  {
    path: '',
    redirect: 'forwardNews/forwardNewsList'
  },
  {
    path: 'home',
    redirect: 'forwardNews/forwardNewsList'
  },
  {
    path: 'forwardNews',
    redirect: 'forwardNews/forwardNewsList'
  }
]

children.push(...home)

export default {
  path: '/:lang/home',
  component: index,
  children: children
}
