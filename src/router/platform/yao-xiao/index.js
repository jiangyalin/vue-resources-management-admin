import index from '../../../components/public/main/index.vue'
import app from './app'

let children = [
  {
    path: '',
    redirect: 'app/appList'
  },
  {
    path: 'app',
    redirect: 'app/appList'
  }
]

children.push(...app)

export default {
  path: '/:lang/yaoxiao',
  component: index,
  children: children
}
