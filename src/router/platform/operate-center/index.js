import index from '../../../components/public/main/index.vue'
import property from './property'
import channel from './channel'
import order from './order'

let children = [
  {
    path: '',
    redirect: 'property/propertyAudit'
  },
  {
    path: 'property',
    redirect: 'property/propertyAudit'
  }
]

children.push(...property)
children.push(...channel)
children.push(...order)

export default {
  path: '/:lang/operateCenter',
  component: index,
  children: children
}
