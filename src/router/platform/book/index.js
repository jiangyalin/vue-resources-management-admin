import index from '../../../components/public/main/index.vue'
import lightNovel from './light-novel'
import awesome from './awesome'

let children = [
  {
    path: '',
    redirect: 'lightNovel/fictionList'
  },
  {
    path: 'lightNovel',
    redirect: 'lightNovel/fictionList'
  },
  {
    path: 'awesome',
    redirect: 'awesome/awesomeList'
  }
]

children.push(...lightNovel)
children.push(...awesome)

export default {
  path: '/:lang/book',
  component: index,
  children: children
}
