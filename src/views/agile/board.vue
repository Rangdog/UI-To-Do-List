<template>
  <div v-if="!activeProject">
    <h1 class="text-2xl font-bold mb-6">Projects</h1>
    <div class="grid grid-cols-3 gap-4">
      <div v-for="item in paginatedProjects" :key="item.project.id"
        class="relative border rounded-xl p-4 shadow bg-white cursor-pointer hover:bg-gray-100"
        @click="selectProject(item)">
        <div class="text-sm font-medium text-gray-900">
          {{ item.project.name }}
        </div>
        <div class="inline-block mt-2 text-xs font-semibold px-2 py-1 rounded bg-yellow-300 text-gray-800">
          {{ item.project.description }}
        </div>
        <div class="mt-2 text-xs text-gray-500">
          Owner: {{ item.user.name }}
        </div>

        <!-- Archived badge -->
        <div v-if="item.project.is_archived === true"
          class="absolute bottom-2 right-2 text-[10px] px-2 py-0.5 bg-gray-300 text-red-700 rounded">
          Complete
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex justify-center mt-6 space-x-2">
      <button class="px-3 py-1 border rounded text-sm" :disabled="currentPage === 1" @click="currentPage--">
        Prev
      </button>
      <button class="px-3 py-1 border rounded text-sm" :disabled="currentPage === totalPages" @click="currentPage++">
        Next
      </button>
    </div>
  </div>

  <!-- Khi đã chọn một project -->
  <div v-else>
    <div class="mb-6">
      <button class="text-blue-600 hover:underline text-sm" @click="backToProject">
        ← Back to Projects
      </button>
      <h1 class="text-2xl font-bold mt-2">{{ activeProject.name }}</h1>
      <p class="text-gray-600">{{ activeProject.description }}</p>
    </div>

    <div class="flex">
      <div v-for="(column, index) in kanbanColumns" :key="column.id" class="w-1/4 p-4"
        :class="index === 0 ? 'bg-gray-200' : index === 1 ? 'bg-blue-100' : index === 2 ? 'bg-green-100' : 'bg-red-100'">
        <h2 class="font-bold mb-2">{{ column.title }} ({{ column.items.length }})</h2>
        <div class="scroll-container">
          <div v-for="item in column.items" :key="item.id" class="border rounded p-2 mb-2"
            :class="item.type === 'step' ? 'bg-blue-50' : 'bg-yellow-50'">
            <router-link :to="item.type === 'step' ? `/steps/${item.id}` : `/tasks/${item.id}`" class="block"
              @click.native="selectBoard">
              <div class="flex justify-between items-center">
                <div class="font-medium">{{ item.name }}</div>
                <span class="text-[10px] px-2 py-0.5 rounded"
                  :class="item.type === 'step' ? 'bg-blue-200 text-blue-800' : 'bg-yellow-200 text-yellow-800'">
                  {{ item.type.toUpperCase() }}
                </span>
              </div>
              <div class="text-sm text-gray-600">{{ item.description }}</div>
              <div class="text-xs text-gray-500 mt-1">Owner: {{ item.user?.name }}</div>
              <div v-if="item.type === 'task'" class="text-[10px] mt-1 text-gray-600">
                <div class="mb-1">Assigner : {{ item?.assigner?.username }}</div>
                <div v-if="item.priority === 0">Priority: Low</div>
                <div v-else-if="item.priority === 1">Priority: Medium</div>
                <div v-else-if="item.priority === 2">Priority: High</div>
                <div>Step: {{ item.step_name }}</div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useProjectStore } from '@/stores/project'
import { useStepStore } from '@/stores/step'
import { useTaskStore } from '@/stores/task'

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

// Data refs
const activeProject = ref<any>(null)
const kanbanColumns = ref<any[]>([])

// Computed values
const project = computed(() => projectStore.projectsAgile)



// Select project
async function selectProject(project: any) {
  activeProject.value = project
  await stepStore.fetchFilteredStepsForAgile(activeProject?.value?.project?.id)
  await taskStore.fetchFilteredTasksForAgile(activeProject?.value?.project?.id)
  updateKanbanColumns()
  localStorage.setItem('projectBoard', JSON.stringify(activeProject?.value?.project?.id))
}

const backToProject = () =>{
  activeProject.value = null
  localStorage.removeItem("projectBoard")
}

function updateKanbanColumns() {
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

  kanbanColumns.value = [
    {
      id: 1,
      title: 'Pending',
      items: allItems.filter(item => item.status_id === 2 && !item.is_archived),
    },
    {
      id: 2,
      title: 'Processing',
      items: allItems.filter(item => item.status_id === 3 && !item.is_archived),
    },
    {
      id: 0,
      title: 'Success',
      items: allItems.filter(item => item.status_id === 1 && !item.is_archived),
    },
    {
      id: 'archived',
      title: 'Archived',
      items: allItems.filter(item => item.is_archived),
    },
  ]
  localStorage.setItem('kanbanColumns', JSON.stringify(kanbanColumns.value))
}
function selectBoard() {
  updateKanbanColumns()
  localStorage.setItem('kanbanColumns', JSON.stringify(kanbanColumns.value))
}


// Load data
onMounted(async () => {
  const project_id = localStorage.getItem('projectBoard')
  if(project_id){
    await stepStore.fetchFilteredStepsForAgile(Number(project_id))
    await taskStore.fetchFilteredTasksForAgile(Number(project_id))
    activeProject.value = project_id
    updateKanbanColumns()
  }
  await projectStore.fetchFilteredProjectsForAgile()
})
</script>

<style scoped>
.scroll-container {
  max-height: 600px;
  /* Giới hạn chiều cao */
  overflow-y: hidden;
  /* Ẩn thanh cuộn khi không hover */
  transition: all 0.3s ease;
  /* Thêm hiệu ứng chuyển đổi */
}

.scroll-container:hover {
  overflow-y: auto;
  /* Hiển thị thanh cuộn khi hover */
}
</style>