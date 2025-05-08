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
      <span class="text-sm">{{ currentPage }} / {{ totalPages }}</span>
      <button class="px-3 py-1 border rounded text-sm" :disabled="currentPage === totalPages" @click="currentPage++">
        Next
      </button>
    </div>
  </div>

  <!-- Khi đã chọn một project -->
  <div v-else>
    <div class="mb-6 bg-white p-4 rounded-lg shadow flex flex-col gap-3">
      <div class="flex justify-between items-center">
        <button class="text-blue-600 hover:underline text-sm flex items-center" @click="backToProject">
          ← Back to Projects
        </button>
        <div class="space-x-2">
          <button @click="showCreateStepModal = true"
            class="px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700">
            + Create Step
          </button>
          <button @click="showCreateTaskModal = true"
            class="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700">
            + Create Task
          </button>
        </div>
      </div>
      <div>
        <h1 class="text-2xl font-bold text-gray-900">{{ activeProject.name }}</h1>
        <p class="text-gray-600">{{ activeProject.description }}</p>
      </div>
    </div>

    <div class="flex">
      <div v-for="(column, index) in kanbanStore.kanbanColumns" :key="column.id" class="w-1/4 p-4"
        :class="index === 0 ? 'bg-gray-200' : index === 1 ? 'bg-blue-100' : index === 2 ? 'bg-green-100' : 'bg-red-100'">

        <h2 class="font-bold mb-2">{{ column.title }} ({{ column.items.length }})</h2>
        <div class="scroll-container" :data-list="column.id">
          <draggable v-model="column.items" :group="{ name: 'kanban', put: true }" :itemKey="'id'"
            @change="(event) => handleDragEnd(event, column)">
            <template #item="{ element }">
              <div :key="element.id" class="border rounded p-2 mb-2"
                :class="element.type === 'step' ? 'bg-blue-50' : 'bg-yellow-50'">
                <router-link :to="element.type === 'step' ? `/steps/${element.id}` : `/tasks/${element.id}`"
                  class="block">
                  <div class="flex justify-between items-center">
                    <div class="font-medium">{{ element.name }}</div>
                    <span class="text-[10px] px-2 py-0.5 rounded"
                      :class="element.type === 'step' ? 'bg-blue-200 text-blue-800' : 'bg-yellow-200 text-yellow-800'">
                      {{ element.type.toUpperCase() }}
                    </span>
                  </div>
                  <div class="text-sm text-gray-600">{{ element.description }}</div>
                  <div class="text-xs text-gray-500 mt-1">Owner: {{ element.user?.name }}</div>
                  <div v-if="element.type === 'task'" class="text-[10px] mt-1 text-gray-600">
                    <div class="mb-1">Assigner: {{ element?.assigner?.username }}</div>
                    <div v-if="element.priority === 0">Priority: Low</div>
                    <div v-else-if="element.priority === 1">Priority: Medium</div>
                    <div v-else-if="element.priority === 2">Priority: High</div>
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
  <div v-if="showCreateStepModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg font-medium text-gray-900">
          Create Step
        </h3>
        <form @submit.prevent="handleSubmitCreateStep" class="mt-4 space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700"> Step Name </label>
            <input id="name" v-model="form.name" type="text" required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea id="description" v-model="form.description" rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
          </div>
          <div class="flex justify-end space-x-3">
            <button type="button" @click="showCreateStepModal = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit"
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- Create Task Modal -->
  <div v-if="showCreateTaskModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg font-medium text-gray-900">
          Create Task
        </h3>
        <form @submit.prevent="handleSubmitCreatTask" class="mt-4 space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700"> Task Name </label>
            <input id="name" v-model="formTask.name" type="text" required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea id="description" v-model="formTask.description" rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
          </div>
          <div>
            <label for="step_id" class="block text-sm font-medium text-gray-700">
              Step
            </label>
            <select id="step_id" v-model="formTask.step_id" required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
              <option disabled value="">-- Select Step --</option>
              <option v-for="step in stepStore.stepsAgile" :key="step.step.id" :value="step.step.id">
                {{ step.step.name }}
              </option>
            </select>
          </div>
          <div class="flex justify-end space-x-3">
            <button type="button" @click="showCreateTaskModal = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit"
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
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
import { useKanbanStore } from '@/stores/kanban' // Import store mới
import draggable from 'vuedraggable'  // Import vuedraggable
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
const kanbanStore = useKanbanStore() // Sử dụng store Pinia cho kanbanColumns

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
const createStep = ref(false)

// Hàm xử lý khi kéo thả (drag)
async function handleDragEnd(event: any, column: any) {
  const movedItem = event.added.element
  const toColumnId = column.id
  let newStatusId: number = 0
  switch (toColumnId) {
    case 1: newStatusId = 2; break
    case 2: newStatusId = 3; break
    case 0: newStatusId = 1; break
    case 'archived': newStatusId = 4; break
  }

  // Wait for the store updates if they are async
  if (newStatusId === 4) {
    if (movedItem.type === 'task') {
      const res = await taskStore.updateTaskArchived(movedItem.id)
      if (res.status) {
        toast.success("Success!")
      } else {
        console.log(res.msg)
        toast.error(res.msg + "!")
      }
    } else {
      const res = await stepStore.updateStepArchived(movedItem.id)
      if (res.status) {
        toast.success("Success!")
      } else {
        toast.error(res.msg + "!")
      }
    }
  } else if (movedItem.type === 'task') {
    const res = await taskStore.updateTaskStatus(movedItem.id, newStatusId)
    if (res.status) {
      toast.success("Success!")
    } else {
      toast.error(res.msg + "!")
    }
  } else if (movedItem.type === 'step') {
    const res = await stepStore.updateStepStatus(movedItem.id, newStatusId)
    if (res.status) {
      toast.success("Success!")
    } else {
      toast.error(res.msg + "!")
    }
  }

  // Once the updates are completed, update the Kanban columns and local storage
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
  localStorage.setItem('projectId', activeProject?.value?.project?.id)
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
    }
    else {
      toast.error(res.msg + "!")
    }
    showCreateStepModal.value = false
    form.value = { name: '', description: '' }
  } catch (error) {
    console.error('Failed to save task:', error)
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
    }
    else {
      toast.error(res.msg + "!")
    }
    showCreateTaskModal.value = false
    formTask.value = { name: '', description: '', step_id: 0 }
  } catch (error) {
    console.error('Failed to save task:', error)
  }
}


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
