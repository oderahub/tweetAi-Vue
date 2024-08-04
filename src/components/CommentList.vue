<template>
  <div class="comment-container">
    <h1>Comments</h1>
    <ul class="comment-list">
      <li v-for="comment in comments" :key="comment.id" class="comment-item">
        {{ comment.text }}
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
  name: 'CommentList',
  setup () {
    const comments = ref([])
    const route = useRoute()
    const socket = io('http://localhost:3000')
    let pollingInterval: number

    const fetchComments = async () => {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/post/${route.params.id}/comments`)
        comments.value = response.data
      } catch (error) {
        console.error('Error fetching Comments:', error)
      }
    }

    const startPolling = () => {
      pollingInterval = window.setInterval(fetchComments, 60000) // Poll every minute
    }

    onMounted(() => {
      socket.on('comments:update', (data) => {
        comments.value = data
      })

      socket.on('connect_error', () => {
        console.log('WebSocket connection error, starting polling...')
        startPolling()
      })

      fetchComments()
    })

    onUnmounted(() => {
      socket.disconnect()
      clearInterval(pollingInterval)
    })

    return { comments, fetchComments }
  }
})
</script>

<style scoped>
.comment-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f8f9fa;
  color: #212529;
  text-align: center;
}

.comment-list {
  list-style-type: none;
  padding: 0;
}

.comment-item {
  background-color: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  margin: 5px 0;
  padding: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>
