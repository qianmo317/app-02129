<template>
  <span class="weather-icon" :style="{ fontSize: size }">
    {{ emoji }}
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { getWeatherInfo } from '../utils/weatherCode'

const props = defineProps({
  code: {
    type: Number,
    required: true
  },
  size: {
    type: String,
    default: '48px'
  }
})

const emoji = computed(() => {
  return getWeatherInfo(props.code).emoji
})
</script>

<style scoped>
.weather-icon {
  display: inline-block;
  line-height: 1;
}
</style>
