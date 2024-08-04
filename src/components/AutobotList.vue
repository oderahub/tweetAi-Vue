
<template>
  <div class="autobot-container">
    <h1>Autobots</h1>
    <button @click="fetchAutobots" class="fetch-button">Load Autobots</button>
    <ul v-if="autobots.length">
      <li v-for="autobot in autobots" :key="autobot.id">
        {{ autobot.name }}
      </li>
    </ul>
    <p v-else>No Autobots found.</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import io from 'socket.io-client'

export default defineComponent({
  name: 'AutobotList',
  setup () {
    const autobots = ref([])
    const socket = io('http://localhost:3000')
    let pollingInterval: number

    const fetchAutobots = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/autobots')
        autobots.value = response.data
      } catch (error) {
        console.error('Error fetching Autobots:', error)
      }
    }

    const startPolling = () => {
      pollingInterval = window.setInterval(fetchAutobots, 60000) // Poll every minute
    }

    onMounted(() => {
      // WebSocket connection
      socket.on('autobots:update', (data) => {
        autobots.value = data
      })

      socket.on('connect_error', () => {
        console.log('WebSocket connection error, starting polling...')
        startPolling()
      })

      // Initial fetch
      fetchAutobots()
    })

    onUnmounted(() => {
      socket.disconnect()
      clearInterval(pollingInterval)
    })

    return { autobots, fetchAutobots }
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
