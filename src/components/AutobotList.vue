<template>
  <div class="autobot-container">
    <h1>Autobots</h1>
    <p>Total Autobots: {{ autobotCount }}</p>
    <button @click="fetchAutobots" class="fetch-button">Load Autobots</button>
    <ul v-if="paginatedAutobots.length">
      <li v-for="autobot in paginatedAutobots" :key="autobot.id">
        <router-link :to="`/autobot/${autobot.id}/posts`">{{ autobot.name }}</router-link>
      </li>
    </ul>
    <p v-else>No Autobots found.</p>
    <button @click="prevPage" :disabled="page === 1">Previous</button>
    <button @click="nextPage" :disabled="page * itemsPerPage >= autobots.length">Next</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import io from 'socket.io-client'

export default defineComponent({
  name: 'AutobotList',
  setup () {
    // Reactive state for autobots list and pagination
    const autobots = ref([])
    const page = ref(1)
    const itemsPerPage = 10
    const socket = io(`${process.env.VUE_APP_SOCKET_URL}`)
    let pollingInterval: number

    // Computed property for total autobots count
    const autobotCount = computed(() => autobots.value.length)

    // Computed property for paginated autobots
    const paginatedAutobots = computed(() => {
      const start = (page.value - 1) * itemsPerPage
      const end = page.value * itemsPerPage
      return autobots.value.slice(start, end)
    })

    // Fetch autobots from the API
    const fetchAutobots = async () => {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/autobots`)
        autobots.value = response.data
      } catch (error) {
        console.error('Error fetching Autobots:', error)
      }
    }

    // Start polling for autobots every minute
    const startPolling = () => {
      pollingInterval = window.setInterval(fetchAutobots, 60000) // Poll every minute
    }

    // Go to the next page of autobots
    const nextPage = () => {
      if ((page.value * itemsPerPage) < autobots.value.length) {
        page.value++
      }
    }

    // Go to the previous page of autobots
    const prevPage = () => {
      if (page.value > 1) {
        page.value--
      }
    }

    // Lifecycle hook - on component mount
    onMounted(() => {
      // Listen for updates via WebSocket
      socket.on('autobots:update', (data) => {
        autobots.value = data
      })

      // Fallback to polling if WebSocket connection fails
      socket.on('connect_error', () => {
        console.log('WebSocket connection error, starting polling...')
        startPolling()
      })

      // Initial fetch of autobots
      fetchAutobots()
    })

    // Lifecycle hook - on component unmount
    onUnmounted(() => {
      socket.disconnect()
      clearInterval(pollingInterval)
    })

    return { autobots, paginatedAutobots, autobotCount, fetchAutobots, nextPage, prevPage, page, itemsPerPage }
  }
})
</script>

<style scoped>
.autobot-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f0f0;
  color: #333;
  text-align: center;
}

.fetch-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  margin-bottom: 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.fetch-button:hover {
  background-color: #0056b3;
}
</style>
