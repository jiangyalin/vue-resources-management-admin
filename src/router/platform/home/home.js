import forwardNewsList from './../../../page/home/forwardNews/forwardNewsList.vue'

export default [
  {
    path: 'forwardNews/forwardNewsList',
    meta: {
      requireAuth: true
    },
    component: forwardNewsList
  }
]
