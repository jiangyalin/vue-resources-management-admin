import index from '../../../components/public/main/index.vue'
import property from './property'
import order from './order'

let children = [
  {
    path: '',
    redirect: 'property/propertyList'
  },
  {
    path: 'property',
    redirect: 'property/propertyList'
  }
]

children.push(...property)
children.push(...order)

export default {
  path: '/:lang/operateCenter',
  component: index,
  children: children
}
