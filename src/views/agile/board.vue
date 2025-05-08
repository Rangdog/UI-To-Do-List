<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Project List View -->
    <div v-if="!activeProject" class="max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Projects</h1>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="item in paginatedProjects"
          :key="item.project.id"
          class="relative bg-blue-100 rounded-2xl shadow-lg p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          @click="selectProject(item)"
        >
          <div class="flex justify-between items-start">
            <div class="text-lg font-semibold text-gray-900">{{ item.project.name }}</div>
            <span
              v-if="item.project.is_archived"
              class="text-xs font-medium px-2 py-1 bg-red-100 text-red-600 rounded-full"
            >
              Completed
            </span>
          </div>
          <div class="mt-2 text-sm text-gray-600 line-clamp-2">Description: {{ item.project.description }}</div>
          <div class="mt-4 text-xs text-gray-500">Owner: {{ item.user.name }}</div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="flex justify-center items-center mt-8 space-x-4">
        <button
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          Previous
        </button>
        <span class="text-sm font-medium text-gray-700">{{ currentPage }} / {{ totalPages }}</span>
        <button
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Kanban Board View -->
    <div v-else class="max-w-500 mx-auto">
      <div class="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div class="flex justify-between items-center mb-6">
          <button
            class="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center transition-colors duration-200"
            @click="backToProject"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Projects
          </button>
          <div class="space-x-3">
            <button
              @click="showCreateStepModal = true"
              class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              + Create Step
            </button>
            <button
              @click="showCreateTaskModal = true"
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              + Create Task
            </button>
          </div>
        </div>
        <h1 class="text-3xl font-bold text-gray-900">{{ activeProject.name }}</h1>
        <p class="text-gray-600 mt-2">{{ activeProject.description }}</p>
      </div>

      <div class="flex space-x-4 overflow-x-auto pb-4">
        <div
          v-for="(column, index) in kanbanStore.kanbanColumns"
          :key="column.id"
          class="w-55 flex-shrink-0 rounded-2xl p-4"
          :class="{
            'bg-gray-200': index === 0,
            'bg-blue-100': index === 1,
            'bg-green-100': index === 2,
            'bg-red-100': index === 3,
          }"
        >
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold text-gray-900">{{ column.title }}</h2>
            <span class="text-sm font-medium text-gray-600">{{ column.items.length }}</span>
          </div>
          <div class="scroll-container">
            <draggable
              v-model="column.items"
              :group="{ name: 'kanban', put: true }"
              :itemKey="'id'"
              @change="(event) => handleDragEnd(event, column)"
            >
              <template #item="{ element }">
                <div
                  class="bg-white rounded-lg shadow p-4 mb-3 cursor-pointer transition-all duration-200 hover:shadow-md"
                >
                  <router-link
                    :to="element.type === 'step' ? `/steps/${element.id}` : `/tasks/${element.id}`"
                    class="block"
                  >
                    <div class="flex justify-between items-center mb-2">
                      <div class="font-medium text-gray-900">{{ element.name }}</div>
                      <span
                        class="text-xs font-medium px-2 py-1 rounded-full"
                        :class="element.type === 'step' ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600'"
                      >
                        {{ element.type.toUpperCase() }}
                      </span>
                    </div>
                    <div class="text-sm text-gray-600 line-clamp-2">{{ element.description }}</div>
                    <div class="text-xs text-gray-500 mt-2">Owner: {{ element.user?.name }}</div>
                    <div v-if="element.type === 'task'" class="text-xs text-gray-600 mt-2 space-y-1">
                      <div>Assigner: {{ element?.assigner?.username }}</div>
                      <div :class="{
                        'text-green-600': element.priority === 0,
                        'text-yellow-600': element.priority === 1,
                        'text-red-600': element.priority === 2,
                      }">
                        Priority: {{ element.priority === 0 ? 'Low' : element.priority === 1 ? 'Medium' : 'High' }}
                      </div>
                      <div>Step: {{ element.step_name }}</div>
                    </div>
                  </router-link>
                </div>
              </template>
            </draggable>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Step Modal -->
    <div
      v-if="showCreateStepModal"
      class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-fade-in">
        <h3 class="text-xl font-semibold text-gray-900 mb-4">Create Step</h3>
        <form @submit.prevent="handleSubmitCreateStep" class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Step Name</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              v-model="form.description"
              rows="4"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            ></textarea>
          </div>
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="showCreateStepModal = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Create Task Modal -->
    <div
      v-if="showCreateTaskModal"
      class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-fade-in">
        <h3 class="text-xl font-semibold text-gray-900 mb-4">Create Task</h3>
        <form @submit.prevent="handleSubmitCreatTask" class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Task Name</label>
            <input
              id="name"
              v-model="formTask.name"
              type="text"
              required
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              v-model="formTask.description"
              rows="4"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            ></textarea>
          </div>
          <div>
            <label for="step_id" class="block text-sm font-medium text-gray-700">Step</label>
            <select
              id="step_id"
              v-model="formTask.step_id"
              required
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option disabled value="">-- Select Step --</option>
              <option v-for="step in stepStore.stepsAgile" :key="step.step.id" :value="step.step.id">
                {{ step.step.name }}
              </option>
            </select>
          </div>
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="showCreateTaskModal = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useProjectStore } from '@/stores/project'
import { useStepStore } from '@/stores/step'
import { useTaskStore } from '@/stores/task'
import { useKanbanStore } from '@/stores/kanban'
import draggable from 'vuedraggable'
import { useToast } from 'vue-toastification'
const toast = useToast()

const currentPage = ref(1)
const pageSize = 15

const totalPages = computed(() => {
  return Math.ceil(project.value.length / pageSize)
})

const paginatedProjects = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return project.value.slice(start, end)
})

// Stores
const projectStore = useProjectStore()
const stepStore = useStepStore()
const taskStore = useTaskStore()
const kanbanStore = useKanbanStore()

// Data refs
const activeProject = ref<any>(null)
const project = computed(() => projectStore.projectsAgile)
const form = ref({
  name: '',
  description: '',
})
const formTask = ref({
  name: '',
  description: '',
  step_id: 0,
})
const showCreateStepModal = ref(false)
const showCreateTaskModal = ref(false)

// Handle drag and drop
async function handleDragEnd(event: any, column: any) {
  const movedItem = event.added?.element
  if (!movedItem) return
  const toColumnId = column.id
  let newStatusId: number = 0
  switch (toColumnId) {
    case 1: newStatusId = 2; break
    case 2: newStatusId = 3; break
    case 0: newStatusId = 1; break
    case 'archived': newStatusId = 4; break
  }

  try {
    let res
    if (newStatusId === 4) {
      if (movedItem.type === 'task') {
        res = await taskStore.updateTaskArchived(movedItem.id)
      } else {
        res = await stepStore.updateStepArchived(movedItem.id)
      }
    } else if (movedItem.type === 'task') {
      res = await taskStore.updateTaskStatus(movedItem.id, newStatusId)
    } else if (movedItem.type === 'step') {
      res = await stepStore.updateStepStatus(movedItem.id, newStatusId)
    }

    if (res?.status) {
      toast.success("Success!")
    } else {
      toast.error(res?.msg || "An error occurred!")
    }
  } catch (error) {
    toast.error("Failed to update item!")
  }

  const projectId = localStorage.getItem("projectId")
  await stepStore.fetchFilteredStepsForAgile(Number(projectId))
  await taskStore.fetchFilteredTasksForAgile(Number(projectId))
  updateKanbanColumns()
  localStorage.setItem('kanbanColumns', JSON.stringify(kanbanStore.kanbanColumns))
}

// Select project
async function selectProject(project: any) {
  activeProject.value = project.project
  await stepStore.fetchFilteredStepsForAgile(activeProject?.value?.id)
  await taskStore.fetchFilteredTasksForAgile(activeProject?.value?.id)
  updateKanbanColumns()
  localStorage.setItem('projectBoard', JSON.stringify(activeProject?.value?.id))
  localStorage.setItem('kanbanColumns', JSON.stringify(kanbanStore.kanbanColumns))
  localStorage.setItem('projectId', activeProject?.value?.id)
}

const backToProject = () => {
  activeProject.value = null
  localStorage.removeItem("projectBoard")
  localStorage.removeItem("projectId")
}

async function updateKanbanColumns() {
  await stepStore.fetchFilteredStepsForAgile(activeProject?.value?.id)
  await taskStore.fetchFilteredTasksForAgile(activeProject?.value?.id)
  const steps = stepStore.stepsAgile.map(step => ({
    id: step.step.id,
    name: step.step.name,
    description: step.step.description,
    user: step.user,
    status_id: step.step.status_id,
    is_archived: step.step.is_archived,
    step_name: null,
    assigner: null,
    priority: null,
    type: 'step',
  }))

  const tasks = taskStore.tasksAgile.map(task => ({
    id: task.task.id,
    name: task.task.name,
    description: task.task.description,
    user: task.user,
    status_id: task.task.status_id,
    is_archived: task.task.is_archived,
    step_name: task.task.Step.name,
    assigner: task.assigner,
    priority: task.task.priority,
    type: 'task',
  }))

  const allItems = [...steps, ...tasks]

  kanbanStore.updateKanbanColumns([
    {
      id: 1,
      title: 'TO DO',
      items: allItems.filter(item => item.status_id === 2 && !item.is_archived),
    },
    {
      id: 2,
      title: 'IN PROGRESS',
      items: allItems.filter(item => item.status_id === 3 && !item.is_archived),
    },
    {
      id: 0,
      title: 'IN REVIEW',
      items: allItems.filter(item => item.status_id === 1 && !item.is_archived),
    },
    {
      id: 'archived',
      title: 'DONE',
      items: allItems.filter(item => item.is_archived),
    },
  ])
  localStorage.setItem('kanbanColumns', JSON.stringify(kanbanStore.kanbanColumns))
}

// Load data
onMounted(async () => {
  const project_id = localStorage.getItem('projectBoard')
  if (project_id) {
    await projectStore.fetchProject(Number(project_id))
    await stepStore.fetchFilteredStepsForAgile(Number(project_id))
    await taskStore.fetchFilteredTasksForAgile(Number(project_id))
    localStorage.setItem("projectId", project_id)
    activeProject.value = projectStore.currentProject
    updateKanbanColumns()
  }
  await projectStore.fetchFilteredProjectsForAgile()
})

const handleSubmitCreateStep = async () => {
  try {
    const res = await stepStore.createStep({
      ...form.value,
      project_id: activeProject.value.id,
    })
    if (res.status) {
      updateKanbanColumns()
      toast.success('Created step!')
    } else {
      toast.error(res.msg || "Failed to create step!")
    }
    showCreateStepModal.value = false
    form.value = { name: '', description: '' }
  } catch (error) {
    toast.error('Failed to create step!')
  }
}

const handleSubmitCreatTask = async () => {
  try {
    const res = await taskStore.createTask({
      ...formTask.value,
      priority: 0,
      assigner: 0,
    })
    if (res.status) {
      updateKanbanColumns()
      toast.success('Created task!')
    } else {
      toast.error(res.msg || "Failed to create task!")
    }
    showCreateTaskModal.value = false
    formTask.value = { name: '', description: '', step_id: 0 }
  } catch (error) {
    toast.error('Failed to create task!')
  }
}
</script>

<style scoped>
.scroll-container {
  max-height: 600px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f7fafc;
}

.scroll-container::-webkit-scrollbar {
  width: 8px;
}

.scroll-container::-webkit-scrollbar-track {
  background: #f7fafc;
  border-radius: 4px;
}

.scroll-container::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 4px;
}

.scroll-container::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>