import index from '../../../components/public/main/index.vue'
import home from './home'

let children = [
  {
    path: '',
    redirect: 'home/home'
  },
  {
    path: 'home',
    redirect: 'home/home'
  }
]

children.push(...home)

export default {
  path: '/:lang/home',
  component: index,
  children: children
}
