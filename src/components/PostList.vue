<template>
  <div class="post-container">
    <h1>Posts</h1>
    <ul class="post-list" v-if="paginatedPosts.length">
      <li v-for="post in paginatedPosts" :key="post.id" class="post-item">
        <router-link :to="`/post/${post.id}/comments`">{{ post.title }}</router-link>
      </li>
    </ul>
    <p v-else>No Posts found.</p>
    <button @click="prevPage" :disabled="page === 1">Previous</button>
    <button @click="nextPage" :disabled="page * itemsPerPage >= posts.length">Next</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'
import io from 'socket.io-client'

export default defineComponent({
  name: 'PostList',
  setup () {
    // Reactive state for posts list and pagination
    const posts = ref([])
    const page = ref(1)
    const itemsPerPage = 10
    const route = useRoute()
    const socket = io(`${process.env.VUE_APP_SOCKET_URL}`)
    let pollingInterval: number

    // Computed property for paginated posts
    const paginatedPosts = computed(() => {
      const start = (page.value - 1) * itemsPerPage
      const end = page.value * itemsPerPage
      return posts.value.slice(start, end)
    })

    // Fetch posts from the API
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/autobot/${route.params.id}/posts`)
        posts.value = response.data
      } catch (error) {
        console.error('Error fetching Posts:', error)
      }
    }

    // Start polling for posts every minute
    const startPolling = () => {
      pollingInterval = window.setInterval(fetchPosts, 60000) // Poll every minute
    }

    // Go to the next page of posts
    const nextPage = () => {
      if ((page.value * itemsPerPage) < posts.value.length) {
        page.value++
      }
    }

    // Go to the previous page of posts
    const prevPage = () => {
      if (page.value > 1) {
        page.value--
      }
    }

    // Lifecycle hook - on component mount
    onMounted(() => {
      // Listen for updates via WebSocket
      socket.on('posts:update', (data) => {
        posts.value = data
      })

      // Fallback to polling if WebSocket connection fails
      socket.on('connect_error', () => {
        console.log('WebSocket connection error, starting polling...')
        startPolling()
      })

      // Initial fetch of posts
      fetchPosts()
    })

    // Lifecycle hook - on component unmount
    onUnmounted(() => {
      socket.disconnect()
      clearInterval(pollingInterval)
    })

    return { posts, paginatedPosts, fetchPosts, nextPage, prevPage, page, itemsPerPage }
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
