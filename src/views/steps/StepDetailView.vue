<template>

  <!-- Filters Section -->
  <div class="flex flex-col sm:flex-row sm:items-end gap-4">
    <!-- Name Filter -->
    <div class="flex-1">
      <label for="filter-name" class="block text-sm font-medium text-gray-700">Tasks Name</label>
      <input id="filter-name" v-model="filters.name" type="text" placeholder="Search name..."
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
    </div>

    <!-- Date Range -->
    <div>
      <label for="start-date" class="block text-sm font-medium text-gray-700">Start Time</label>
      <input id="start-date" v-model="filters.startTime" type="date"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
    </div>

    <div>
      <label for="end-date" class="block text-sm font-medium text-gray-700">End Time</label>
      <input id="end-date" v-model="filters.endTime" type="date"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
    </div>

    <!-- Status Filter Combobox -->
    <div class="mt-6">
      <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
      <select id="status" v-model="filters.status"
        class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
        <option :value="null">All</option>
        <option :value="1">Success</option>
        <option :value="2">Pending</option>
        <option :value="3">Processing</option>
      </select>
    </div>

    <!-- SoftBy Filter Combobox -->
    <div class="mt-6">
      <label for="softBy" class="block text-sm font-medium text-gray-700">Soft by</label>
      <select id="softBy" v-model="filters.softBy"
        class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
        <option :value="0">---</option>
        <option :value="1">Name ASC</option>
        <option :value="2">Name DESC</option>
        <option :value="3">created ASC</option>
        <option :value="4">created DESC</option>
        <option :value="5">Updated ASC</option>
        <option :value="6">Updated DESC</option>
      </select>
    </div>

    <!-- IsArchived Checkbox -->
    <div class="flex items-center mt-6">
      <input id="archived" type="checkbox" v-model="filters.isArchived"
        class="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
      <label for="archived" class="ml-2 block text-sm text-gray-700">Archived</label>
    </div>


    <!-- Apply Filter Button -->
    <div class="mt-6">
      <button @click="applyFilters"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
        Apply
      </button>
    </div>
  </div>


  <div class="space-y-6 mt-6">
    <!-- Step Header -->
    <div class="bg-white shadow rounded-lg p-6">
      <div class="flex flex-col space-y-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Step name: {{ step?.name }}</h1>
          <p class="mt-2 text-gray-500">Description: {{ step?.description }}</p>
        </div>

        <div class="flex flex-wrap gap-4 justify-between">
          <router-link :to="`/projects/${step?.project_id}`"
            class="px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-600 rounded-md hover:bg-indigo-50 inline-flex items-center justify-center">
            Back To Project
          </router-link>
          <router-link :to="`/manage/steps/${step?.id}`"
            class="px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-600 rounded-md hover:bg-indigo-50 inline-flex items-center justify-center">
            Manage Permission
          </router-link>
          <button @click="showCreateTaskModal = true"
            class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
            Add task
          </button>
          <button v-for="action in stepAction" :key="action.label" @click="openConfirmDialog(action.status)"
            :class="action.class">
            {{ action.label }}
          </button>
        </div>
      </div>
      <div class="mt-4 flex items-center space-x-2">
      <span :class="{
        'bg-green-100 text-green-800': step?.status_id === 1,
        'bg-yellow-100 text-yellow-800': step?.status_id === 2,
        'bg-blue-100 text-blue-800': step?.status_id === 3,
      }" class="px-2 py-1 text-xs font-medium rounded-full">
        {{ getStatusText(step?.status_id) }}
      </span>
    </div>
    </div>
  </div>

  <!-- Tasks List -->
  <div class="space-y-4 mt-4">
    <div v-for="task in taskStore.tasks" :key="task.id"
      class="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow">
      <div class="flex justify-between items-start">
        <div>
          <h2 class="text-lg font-medium text-gray-900">{{ task.name }}</h2>
          <p class="mt-2 text-sm text-gray-500">{{ task.description }}</p>
        </div>
        <div class="flex space-x-2">
          <button @click="editTask(task)" class="text-gray-400 hover:text-gray-500">
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <!-- <button @click="deleteTask(task.id)" class="text-gray-400 hover:text-red-500">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
            </button> -->
        </div>
      </div>
      <div class="mt-4 flex justify-between items-center">
        <div class="flex items-center space-x-2">
          <span :class="{
            'bg-green-100 text-green-800': task.status_id === 1,
            'bg-yellow-100 text-yellow-800': task.status_id === 2,
            'bg-blue-100 text-blue-800': task.status_id === 3,
          }" class="px-2 py-1 text-xs font-medium rounded-full">
            {{ getStatusText(task.status_id) }}
          </span>

        </div>
        <router-link :to="`/tasks/${task.id}`" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">
          View Details →
        </router-link>
      </div>
    </div>
  </div>
    <!-- Ô input và nút gửi -->
    <div class="flex items-center space-x-2 mt-2">
      <input v-model="newComment" type="text" placeholder="Comment..."
        class="flex-1 px-3 py-1 border rounded-md text-sm" />
      <button @click="addComment(step?.id || 1)"
        class="px-2 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700">
        Send
      </button>
    </div>

    <!-- Danh sách comment -->
    <ul class="text-sm text-gray-700 space-y-2 mt-2">
      <li v-for="(comment, index) in comments" :key="index" class="bg-gray-50 p-2 rounded">
        <!-- Hiển thị bình thường -->
        <div v-if="editingCommentId !== comment.id">
          <p><strong>Account:</strong> {{ comment?.user_id }}</p>
          <p><strong>Content:</strong> {{ comment?.content }}</p>
          <div class="flex space-x-3 mt-1">
            <button @click="startEditing(comment)" class="text-sm text-indigo-600 hover:underline">
              Edit
            </button>
            <button @click="deleteComment(comment.id)" class="text-sm text-red-600 hover:underline">
              Delete
            </button>
          </div>
        </div>

        <!-- Chế độ chỉnh sửa -->
        <div v-else class="space-y-1">
          <input v-model="editedContent" type="text" class="w-full px-2 py-1 border rounded-md text-sm" />
          <div class="flex space-x-2 mt-1">
            <button @click="saveCommentEdit(comment.id)"
              class="text-sm text-white bg-green-600 px-3 py-1 rounded hover:bg-green-700">
              Save
            </button>
            <button @click="cancelEdit" class="text-sm text-gray-600 px-3 py-1 border rounded hover:bg-gray-200">
              Cancel
            </button>
          </div>
        </div>
      </li>
    </ul>

  <!-- Empty State -->
  <div v-if="!loading && taskStore.tasks.length === 0" class="text-center py-12">
    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
    <h3 class="mt-2 text-sm font-medium text-gray-900">No tasks</h3>
    <p class="mt-1 text-sm text-gray-500">Get started by creating a new task.</p>
    <div class="mt-6">
      <button @click="showCreateTaskModal = true"
        class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        <svg class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        New Task
      </button>
    </div>
  </div>

  <!-- Loading State -->
  <div v-else-if="loading" class="text-center py-12">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
  </div>

  <div class="mt-6 flex justify-center space-x-2">
    <button @click="prevPage" class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300">
      Prev
    </button>
    <span>Page {{ currentPage }}</span>
    <button @click="nextPage" class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300">
      Next
    </button>
  </div>

  <!-- Confirm Dialog -->
  <div v-if="showConfirmDialog" class="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
    <div class="bg-white rounded-md shadow p-6 w-full max-w-sm">
      <h2 class="text-lg font-semibold mb-4">Xác nhận thay đổi trạng thái</h2>
      <p class="text-sm text-gray-700 mb-6">Bạn có chắc muốn chuyển task sang trạng thái "<strong>{{
        getStatusText(confirmStatus || 0) }}</strong>" không?</p>
      <div class="flex justify-end space-x-3">
        <button @click="showConfirmDialog = false"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100">
          Cancel
        </button>
        <div v-if="confirmStatus != 4">
          <button @click="confirmChangeStatus"
            class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700">
            Comfirm
          </button>
        </div>
        <div v-else>
          <button @click="confirmChangeArchived"
            class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700">
            Comfirm
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Create/Edit Task Modal -->
  <div v-if="showCreateTaskModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg font-medium text-gray-900">
          {{ editingTask ? 'Edit Task' : 'Create Task' }}
        </h3>
        <form @submit.prevent="handleSubmit" class="mt-4 space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700"> Task Name </label>
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
            <button type="button" @click="showCreateTaskModal = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit"
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
              {{ editingTask ? 'Update' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStepStore } from '@/stores/step'
import { useTaskStore } from '@/stores/task'
import type { Task } from '@/stores/step'
import { useToast } from 'vue-toastification'

const toast = useToast()

const route = useRoute()
const stepStore = useStepStore()
const taskStore = useTaskStore()

const step = computed(() => stepStore.currentStep)
const loading = computed(() => stepStore.loading)
const comments = computed(() => stepStore.comments)

const showCreateTaskModal = ref(false)
const editingTask = ref<Task | null>(null)
const showConfirmDialog = ref(false)
const confirmStatus = ref<number | null>(null)
const editingCommentId = ref<number | null>(null)
  const newComment = ref<string>("")
  const editedContent = ref('')
const form = ref({
  name: '',
  description: '',
})

const currentPage = ref(1)
const limit = ref(10)
const filters = ref({
  name: '',
  startTime: '',
  endTime: '',
  status: null as number | null,
  isArchived: false,
  softBy: 0,
})

const applyFilters = async () => {
  try {
    await taskStore.fetchFilteredTasks({
      name: filters.value.name,
      startTime: filters.value.startTime || undefined,
      endTime: filters.value.endTime || undefined,
      status: filters.value.status || 0,
      isArchived: filters.value.isArchived,
      soft_by: filters.value.softBy,
      page: currentPage.value,
      limit: limit.value,
      step_id: step?.value?.id,
    })
  } catch (error) {
    console.error('Error while applying filters:', error)
  }
}

const startEditing = (comment: any) => {
  editingCommentId.value = comment.id
  editedContent.value = comment.content
}

const cancelEdit = () => {
  editingCommentId.value = null
  editedContent.value = ''
}

const saveCommentEdit = async (commentId: number) => {
  if (!editedContent.value.trim()) return

  const res = await stepStore.updateComment(commentId, 
    editedContent.value.trim()
  )
  if(res){
    await stepStore.fetchCommentForStep(step.value?.id||-1)
    editingCommentId.value = null
    editedContent.value = ''
    toast.success("Edited comment!")
  }else{
    toast.error("Some thing went wrong!")
  }

}
const addComment = async (id: number) => {
  const comment = newComment.value?.trim()
  const res = await stepStore.createComment(id, comment)
  if (res) {
      await stepStore.fetchCommentForStep(step.value?.id||-1)
      newComment.value = ''
      toast.success("Added comment!")
    } else {
      toast.warning("Something went wrong!")
      console.warn('Có gì đó sai sai 🤔')
    }
}

const deleteComment = async (commentId: number) => {
  if (confirm('Are you want delete this comment?')) {
    try {
      const res = await stepStore.deleteComment(commentId)
      if (res) {
        await stepStore.fetchCommentForStep(step.value?.id||-1)
        toast.success('Deleted comment!')
      }
      else {
        toast.error('Something went wrong!')
      }
    } catch (error) {
      console.error('Xoá bình luận thất bại:', error)
      toast.error('Something went wrong!')
    }
  }
}

watch(filters, () => {
  currentPage.value = 1
  taskStore.fetchFilteredTasks(
    {
      name: filters.value.name,
      startTime: filters.value.startTime || undefined,
      endTime: filters.value.endTime || undefined,
      status: filters.value.status || 0,
      isArchived: filters.value.isArchived,
      soft_by: filters.value.softBy,
      page: currentPage.value,
      limit: limit.value,
      step_id: step?.value?.id,
    }
  )
}, { deep: true })

const nextPage = () => {
  currentPage.value++
  taskStore.fetchFilteredTasks(
    {
      name: filters.value.name,
      startTime: filters.value.startTime || undefined,
      endTime: filters.value.endTime || undefined,
      status: filters.value.status || 0,
      isArchived: filters.value.isArchived,
      soft_by: filters.value.softBy,
      page: currentPage.value,
      limit: limit.value,
      step_id: step?.value?.id,
    }
  )
}
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    taskStore.fetchFilteredTasks(
      {
        name: filters.value.name,
        startTime: filters.value.startTime || undefined,
        endTime: filters.value.endTime || undefined,
        status: filters.value.status || 0,
        isArchived: filters.value.isArchived,
        soft_by: filters.value.softBy,
        page: currentPage.value,
        limit: limit.value,
        step_id: step?.value?.id,
      }
    )
  }
}

const openConfirmDialog = (status: number) => {
  confirmStatus.value = status
  showConfirmDialog.value = true
}

const confirmChangeStatus = async () => {
  if (!step.value || confirmStatus.value === null) return
  try {
    const res = await stepStore.updateStepStatus(step.value.id, confirmStatus.value)
    if (res) {
      await stepStore.fetchStep(step.value.id) // Refresh lại step
      toast.success('Changed status')
    } else {
      toast.error('Something went wrong')
    }
  } catch (err) {
    console.error('Failed to update task status:', err)
  } finally {
    showConfirmDialog.value = false
    confirmStatus.value = null
  }
}

const confirmChangeArchived = async () => {
  if (!step.value || confirmStatus.value === null) return

  try {
    const res = await stepStore.updateStepArchived(step.value.id, confirmStatus.value)
    if (res) {
      await stepStore.fetchStep(step.value.id) // Refresh lại step
      toast.success('Mark as archived!') // Refresh lại task
    } else {
      toast.error('Something went wrong')
    }
  } catch (err) {
    console.error('Failed to update task status:', err)
  } finally {
    showConfirmDialog.value = false
    confirmStatus.value = null
  }
}


onMounted(async () => {
  const stepId = Number(route.params.id)
  await stepStore.fetchStep(stepId)
  await taskStore.fetchFilteredTasks(
    {
      name: filters.value.name,
      startTime: filters.value.startTime || undefined,
      endTime: filters.value.endTime || undefined,
      status: filters.value.status || 0,
      isArchived: filters.value.isArchived,
      soft_by: filters.value.softBy,
      page: currentPage.value,
      limit: limit.value,
      step_id: step?.value?.id,
    })
  await stepStore.fetchCommentForStep(stepId)
})

const getStatusText = (statusId?: number) => {
  switch (statusId) {
    case 1:
      return 'Success'
    case 2:
      return 'Pending'
    case 3:
      return 'Processing'
    default:
      return 'Unknown'
  }
}

const handleSubmit = async () => {
  try {
    if (editingTask.value) {
      const res = await taskStore.updateTask(editingTask.value.id, form.value)
      if (res) {
        toast.success('Updated task!')
      }
      else {
        toast.error('Something went wrong!')
      }
    } else {
      const res = await taskStore.createTask({
        ...form.value,
        step_id: Number(route.params.id),
        priority: 0,
        assigner: 0,
      })
      if (res) {
        toast.success('Created task!')
        stepStore.fetchStep(step?.value?.id || -1)
      }
      else {
        toast.error('Something went wrong!')
      }
    }
    showCreateTaskModal.value = false
    form.value = { name: '', description: '' }
    editingTask.value = null
  } catch (error) {
    console.error('Failed to save task:', error)
  }
}

const editTask = (task: Task) => {
  editingTask.value = task
  form.value = {
    name: task.name,
    description: task.description,
  }
  showCreateTaskModal.value = true
}

const deleteTask = async (id: number) => {
  if (confirm('Are you sure you want to delete this task?')) {
    try {
      await stepStore.deleteTask(id)
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }
}

const stepAction = computed(() => {
  if (!step?.value?.status_id) return [];
  switch (step?.value.status_id) {
    case 1:
      return [
        { label: "Mark as Archived", status: 4, class: "px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700" },
        { label: "Mark as processing", status: 3, class: "px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700" },
        { label: "Mark as pending", status: 2, class: "px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700" },
      ];
    case 2:
      return [
        { label: "Mark as Archived", status: 4, class: "px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700" },
        { label: "Mark as success", status: 1, class: "px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700" },
        { label: "Mark as processing", status: 3, class: "px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700" },
      ];
    case 3:
      return [
        { label: "Mark as Archived", status: 4, class: "px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700" },
        { label: "Mark as success", status: 1, class: "px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700" },
        { label: "Mark as pending", status: 2, class: "px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700" },
      ];
    default:
      return [];
  }
});

</script>
