import index from '../../../components/public/main/index.vue'
import lightNovel from './light-novel'

let children = [
  {
    path: '',
    redirect: 'lightNovel/fictionList'
  },
  {
    path: 'lightNovel',
    redirect: 'lightNovel/fictionList'
  }
]

children.push(...lightNovel)

export default {
  path: '/:lang/book',
  component: index,
  children: children
}
