<template>
  <div class="home">
    <AutobotCounter />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AutobotCounter from '../components/AutobotCounter.vue';

export default defineComponent({
  name: 'HomeView',
  components: {
    AutobotCounter,
  },
});
</script>

<style scoped>
.home {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
