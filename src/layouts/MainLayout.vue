<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold text-gray-900">To-Do List</h1>
          <div class="flex items-center space-x-4">
            <span class="text-gray-700">{{ userStore.user?.name }}</span>
            <button @click="handleLogout"
              class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex">
        <!-- Sidebar -->
        <aside class="w-64 mr-8">
          <nav class="bg-white rounded-lg shadow p-4">
            <ul class="space-y-2">
              <li>
                <router-link to="/" class="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                  :class="{ 'bg-gray-100': $route.path === '/' }">
                  Dashboard
                </router-link>
              </li>
              <li>
                <router-link to="/agile_scrum_board" class="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                  :class="{ 'bg-gray-100': $route.path.startsWith('/projects') }">
                  agile scrum board
                </router-link>
              </li>
            </ul>
          </nav>
        </aside>

        <!-- Content -->
        <main class="flex-1">
          <router-view />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { onMounted } from 'vue'

const router = useRouter()
const userStore = useUserStore()

const handleLogout = () => {
  localStorage.removeItem('token')
  userStore.clearUser()
  router.push('/login')
}
</script>
