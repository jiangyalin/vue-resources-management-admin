import index from '../../../components/public/main/index.vue'
import user from './user'

let children = [
  {
    path: '',
    redirect: 'user/userList'
  },
  {
    path: 'user',
    redirect: 'user/userList'
  }
]

children.push(...user)

export default {
  path: '/:lang/user',
  component: index,
  children: children
}
