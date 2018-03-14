import index from '../../../components/public/main/index.vue'
import user from './user'
import account from './account'

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
children.push(...account)

export default {
  path: '/:lang/user',
  component: index,
  children: children
}
