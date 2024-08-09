<template>
  <div id="app">
    <AutobotCounter />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AutobotCounter from './components/AutobotCounter.vue';

export default defineComponent({
  name: 'App',
  components: {
    AutobotCounter,
  },
});
</script>

<style>
</style>
