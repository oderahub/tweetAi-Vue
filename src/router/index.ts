import { createRouter, createWebHistory } from 'vue-router'
import AutobotList from '@/components/AutobotList.vue'
import PostList from '@/components/PostList.vue'
import CommentList from '@/components/CommentList.vue'

const routes = [
  {
    path: '/',
    name: 'AutobotList',
    component: AutobotList
  },
  {
    path: '/autobot/:id/posts',
    name: 'PostList',
    component: PostList
  },
  {
    path: '/post/:id/comments',
    name: 'CommentList',
    component: CommentList
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
