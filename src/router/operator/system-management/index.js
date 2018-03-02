import VueCookie from 'vue-cookie'
import index from './../../../components/public/main/index.vue'
import account from './account'

const user = VueCookie.get('user')

let children = [
  {
    path: '',
    redirect: 'account/accountList/accountEdit/' + user
  },
  {
    path: 'account',
    redirect: 'account/accountList/accountEdit/' + user
  },
  {
    path: 'account/accountList/',
    redirect: 'account/accountList/accountEdit/' + user
  }
]

children.push(...account)

export default {
  path: '/:lang/systemManagement',
  component: index,
  children: children
}
