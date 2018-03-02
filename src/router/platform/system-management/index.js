import index from './../../../components/public/main/index.vue'

import account from './account'

let children = [
  {
    path: '',
    redirect: 'account/accountList'
  },
  {
    path: 'account',
    redirect: 'account/accountList'
  }
]

children.push(...account)

export default {
  path: '/:lang/systemManagement',
  component: index,
  children: children
}
