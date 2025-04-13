<template>
  <div class="dashboard">
    <h1>Dashboard</h1>
    <ul>
      <li v-for="project in projects" :key="project.id">
        <router-link :to="`/projects/${project.id}`">{{ project.name }}</router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/composables/useApi'

const projects = ref([])

onMounted(async () => {
  try {
    const response = await api.get('/projects')
    projects.value = response.data
  } catch (error) {
    console.error('Failed to fetch projects', error)
  }
})
</script>
