import index from '../../../components/public/main/index.vue'
import settlement from './settlement'

let children = [
  {
    path: '',
    redirect: 'settlement/settlementList'
  },
  {
    path: 'settlement',
    redirect: 'settlement/settlementList'
  }
]

children.push(...settlement)

export default {
  path: '/:lang/financialCenter',
  component: index,
  children: children
}
