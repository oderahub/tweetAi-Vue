<template>
  <div class="post-container">
    <h1>Posts</h1>
    <ul class="post-list">
      <li v-for="post in posts" :key="post.id" class="post-item">
        <router-link :to="`/post/${post.id}/comments`">{{ post.title }}</router-link>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'
import io from 'socket.io-client'

export default defineComponent({
  name: 'PostList',
  setup () {
    const posts = ref([])
    const route = useRoute()
    const socket = io('http://localhost:3000')
    let pollingInterval: number

    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/autobot/${route.params.id}/posts`)
        posts.value = response.data
      } catch (error) {
        console.error('Error fetching Posts:', error)
      }
    }

    const startPolling = () => {
      pollingInterval = window.setInterval(fetchPosts, 60000) // Poll every minute
    }

    onMounted(() => {
      socket.on('posts:update', (data) => {
        posts.value = data
      })

      socket.on('connect_error', () => {
        console.log('WebSocket connection error, starting polling...')
        startPolling()
      })

      fetchPosts()
    })

    onUnmounted(() => {
      socket.disconnect()
      clearInterval(pollingInterval)
    })

    return { posts, fetchPosts }
  }
})
</script>

<style scoped>
.post-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f8f9fa;
  color: #212529;
  text-align: center;
}

.post-list {
  list-style-type: none;
  padding: 0;
}

.post-item {
  background-color: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  margin: 5px 0;
  padding: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.post-item a {
  text-decoration: none;
  color: #007bff;
}

.post-item a:hover {
  text-decoration: underline;
}
</style>
