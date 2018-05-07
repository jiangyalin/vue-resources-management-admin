import index from '../../../components/public/main/index.vue'
import banner from './banner'

let children = [
  {
    path: '',
    redirect: 'banner/bannerList'
  },
  {
    path: 'banner',
    redirect: 'banner/bannerList'
  }
]

children.push(...banner)

export default {
  path: '/:lang/operations',
  component: index,
  children: children
}
