import index from '../../../components/public/main/index.vue'
import settlement from './settlement'

let children = [
  {
    path: '',
    redirect: 'statistics/orderStatistics'
  },
  {
    path: 'statistics',
    redirect: 'statistics/orderStatistics'
  }
]

children.push(...settlement)

export default {
  path: '/:lang/financialCenter',
  component: index,
  children: children
}
