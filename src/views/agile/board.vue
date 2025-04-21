<template>
  <div class="flex space-x-4 p-4 bg-white shadow-md rounded mb-6">
    <button class="px-4 py-2 rounded font-semibold"
      :class="activeTab === 'project' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'"
      @click="activeTab = 'project'">
      Project
    </button>
    <button class="px-4 py-2 rounded font-semibold"
      :class="activeTab === 'step' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'"
      @click="activeTab = 'step'">
      Step
    </button>
    <button class="px-4 py-2 rounded font-semibold"
      :class="activeTab === 'task' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'"
      @click="activeTab = 'task'">
      Task
    </button>
  </div>
  <div v-if="activeTab === 'project'" class="p-6 bg-gray-50 min-h-screen">
    <h1 class="text-2xl font-bold mb-6">Project</h1>
    <div class="flex space-x-4">
      <div v-for="column in project" :key="column.id" class="bg-white rounded-lg shadow-md w-1/2 flex-shrink-0">
        <div class="p-4 border-b font-semibold text-gray-700">
          {{ column.title }} {{ column.items?.length }}
        </div>
        <div class="p-2 space-y-3">
          <div v-for="item in column.items" :key="item.name"
            :class="['border rounded-xl p-4 shadow transition-all', column.id == 'archive' ? 'bg-gray-200' : 'bg-white ']">
            <router-link :to="`/projects/${item.id}`" class="text-sm font-medium text-blue-600 hover:underline">
              <div class="text-sm font-medium text-gray-900">
                {{ item.name }}
              </div>
              <div class="inline-block mt-2 text-xs font-semibold px-2 py-1 rounded bg-yellow-300 text-gray-800">
                {{ item.description }}
              </div>
              <div class="mt-2 flex items-center justify-between text-xs text-gray-500">
                <div class="flex items-center gap-1">
                  <span>Owner:</span>
                  <span>{{ item.user.name }}</span>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="activeTab === 'step'" class="p-6 bg-gray-50 min-h-screen">
    <h1 class="text-2xl font-bold mb-6">Step</h1>
    <div class="flex space-x-4">
      <div v-for="column in steps" :key="column.id" class="bg-white rounded-lg shadow-md w-1/4 flex-shrink-0">
        <div class="p-4 border-b font-semibold text-gray-700">
          {{ column.title }} {{ column.items?.length }}
        </div>
        <div class="p-2 space-y-3">
          <div v-for="item in column.items" :key="item.name"
            :class="['border rounded-xl p-4 shadow transition-all', column.id == 'archive' ? 'bg-gray-200' : column.id == 'pending' ? 'bg-yellow-50' : column.id == 'processing' ? 'bg-blue-100' : column.id == 'success' ? 'bg-green-100' : 'bg-white']">
            <router-link :to="`/steps/${item.id}`" class="block">
              <div class="text-sm font-medium text-gray-900">
                {{ item.name }}
              </div>
              <div class="inline-block mt-2 text-xs font-semibold px-2 py-1 rounded bg-yellow-300 text-gray-800">
                {{ item.description }}
              </div>
              <div class="mt-2 flex items-center justify-between text-xs text-gray-500">
                <div class="flex items-center gap-1">
                  <span>Owner:</span>
                  <span>{{ item.user.name }}</span>
                </div>

              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="activeTab === 'task'" class="p-6 bg-gray-50 min-h-screen">
    <h1 class="text-2xl font-bold mb-6">Task</h1>
    <div class="flex space-x-4">
      <div v-for="column in tasks" :key="column.id" class="bg-white rounded-lg shadow-md w-1/4 flex-shrink-0">
        <div class="p-4 border-b font-semibold text-gray-700">
          {{ column.title }} {{ column.items?.length }}
        </div>
        <div class="p-2 space-y-3">
          <div v-for="item in column.items" :key="item.name"
            :class="['border rounded-xl p-4 shadow transition-all', column.id == 'archive' ? 'bg-gray-200' : column.id == 'pending' ? 'bg-yellow-50' : column.id == 'processing' ? 'bg-blue-100' : column.id == 'success' ? 'bg-green-100' : 'bg-white']">
            <router-link :to="`/tasks/${item.id}`" class="block">
              <div class="text-sm font-medium text-gray-800">
                {{ item.name }}
              </div>
              <!-- Description Badge -->
              <div class="inline-block mt-2 text-xs font-medium px-2 py-1 rounded-full bg-yellow-300 text-gray-800">
                {{ item.description }}
              </div>
              <div class="mt-3 text-sm">
                <span class="font-medium text-gray-600">Priority:</span>
                <span :class="[
                  'ml-1 px-2 py-0.5 rounded-full text-xs font-semibold',
                  item.priority === 0 ? 'bg-gray-200 text-gray-700' :
                    item.priority === 1 ? 'bg-yellow-200 text-yellow-800' :
                      item.priority === 2 ? 'bg-red-200 text-red-800' : ''
                ]">
                  {{ item.priority === 0 ? 'Low' : item.priority === 1 ? 'Medium' : 'High' }}
                </span>
              </div>
              <div class="mt-1 text-sm text-gray-700">
                <span class="font-medium">Assigner:</span>
                {{ item.assigner?.username || 'None' }}
              </div>
              <div class="mt-1 flex items-center text-sm text-gray-700">
                <span class="font-medium mr-1">Owner:</span>
                <span>{{ item.user.name }}</span>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- <div class="p-6 bg-gray-50 min-h-screen">
      <h1 class="text-2xl font-bold mb-6">Board</h1>
      <div class="flex space-x-4 overflow-x-auto">
        <div
          v-for="column in columns"
          :key="column.id"
          class="bg-white rounded-lg shadow-md w-72 flex-shrink-0"
        >
          <div class="p-4 border-b font-semibold text-gray-700">
            {{ column.title }} {{ column.tasks.length }}
          </div>
          <div class="p-2 space-y-3">
            <div
              v-for="task in column.tasks"
              :key="task.id"
              class="bg-white border rounded p-3 shadow-sm"
            >
              <div class="text-sm font-medium text-gray-900">
                {{ task.title }}
              </div>
              <div
                class="inline-block mt-2 text-xs font-semibold px-2 py-1 rounded bg-yellow-300 text-gray-800"
              >
                {{ task.tag }}
              </div>
              <div class="mt-2 flex items-center justify-between text-xs text-gray-500">
                <div class="flex items-center gap-1">
                  <span>⬆️</span>
                  <span>{{ task.votes }}</span>
                </div>
                <div>{{ task.code }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> -->
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useProjectStore } from '@/stores/project'
import { useStepStore } from '@/stores/step'
import { useTaskStore } from '@/stores/task'


const activeTab = ref(localStorage.getItem('activeAgileTab') || 'project')
const projectStore = useProjectStore()
const stepStore = useStepStore()
const taskStore = useTaskStore()
const project = computed(() => projectStore.projectsAgile)
const steps = computed(() => stepStore.stepsAgile)
const tasks = computed(() => taskStore.tasksAgile)
watch(activeTab, (newTab) => {
  localStorage.setItem('activeAgileTab', newTab)
})

onMounted(async () => {
  await projectStore.fetchFilteredProjectsForAgile()
  await stepStore.fetchFilteredStepsForAgile()
  await taskStore.fetchFilteredTasksForAgile()
})
</script>