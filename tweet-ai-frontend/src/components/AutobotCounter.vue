<template>
  <div class="autobot-counter flex items-center justify-center h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white">
    <div class="card">
      <h2 class="text-4xl font-bold mb-4">Current Autobot Count</h2>
      <div class="flipping-container">
        <div class="flip-card">
          <div class="flip-card-inner">
            <div class="flip-card-front">{{ autobotCount }}</div>
            <div class="flip-card-back">{{ autobotCount }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import socket from '../socket';
import axios from 'axios';

export default defineComponent({
  name: 'AutobotCounter',
  setup() {
    const autobotCount = ref<number>(0);

    // Fetch initial count from the API
    const fetchInitialCount = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/autobots');
        autobotCount.value = response.data.length;
      } catch (error) {
        console.error('Error fetching initial Autobot count:', error);
      }
    };

    onMounted(() => {
      // Fetch initial count
      fetchInitialCount();

      // Listen for WebSocket updates
      socket.on('autobots:update', (autobots: any[]) => {
        autobotCount.value = autobots.length;
      });

      // Request initial update via WebSocket (optional but good for ensuring connection)
      socket.emit('autobots:requestUpdate');
    });

    return {
      autobotCount,
    };
  },
});
</script>

<style scoped>
.autobot-counter {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

/* Card styling */
.card {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  text-align: center;
  min-width: 300px; 
}

/* Title styles */
h2 {
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
}

/* Flipping card container */
.flipping-container {
  display: inline-block;
  perspective: 1000px;
}

/* Flip card structure */
.flip-card {
  width: 150px;
  height: 200px;
  margin: 0 auto;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
  animation: flip 2s infinite;
}

.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  font-weight: 800;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.5);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
}

.flip-card-front {
  background: linear-gradient(to top, #ff7e5f, #feb47b);
}

.flip-card-back {
  background: linear-gradient(to top, #43cea2, #185a9d);
  transform: rotateX(180deg);
}

@keyframes flip {
  0% {
    transform: rotateX(0);
  }
  50% {
    transform: rotateX(180deg);
  }
  100% {
    transform: rotateX(360deg);
  }
}
</style>
