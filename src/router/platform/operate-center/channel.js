import channelList from './../../../page/operate-center/channel/channelList.vue'
import channelAdd from './../../../page/operate-center/channel/channelAdd.vue'
import channelEdit from './../../../page/operate-center/channel/channelEdit.vue'
import channelBinding from './../../../page/operate-center/channel/channelBinding.vue'

export default [
  {
    path: 'channel',
    redirect: 'channel/channelList'
  },
  {
    path: 'channel/channelList',
    meta: {
      requireAuth: true
    },
    component: channelList
  },
  {
    path: 'channel/channelList/channelEdit/:channelId',
    meta: {
      requireAuth: true
    },
    component: channelEdit
  },
  {
    path: 'channel/channelAdd',
    meta: {
      requireAuth: true
    },
    component: channelAdd
  },
  {
    path: 'channel/channelList/channelBinding/:channelId',
    meta: {
      requireAuth: true
    },
    component: channelBinding
  }
]
