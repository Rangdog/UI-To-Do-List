<template>
  <!-- Filters Section -->
  <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
    <h2 class="text-lg font-semibold text-gray-900 mb-4">Filter Tasks</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <!-- Name Filter -->
      <div>
        <label for="filter-name" class="block text-sm font-medium text-gray-700">Task Name</label>
        <input
          id="filter-name"
          v-model="filters.name"
          type="text"
          placeholder="Search by name..."
          class="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
        />
      </div>

      <!-- Date Range -->
      <div>
        <label for="start-date" class="block text-sm font-medium text-gray-700">Start Date</label>
        <input
          id="start-date"
          v-model="filters.startTime"
          type="date"
          class="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
        />
      </div>

      <div>
        <label for="end-date" class="block text-sm font-medium text-gray-700">End Date</label>
        <input
          id="end-date"
          v-model="filters.endTime"
          type="date"
          class="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
        />
      </div>

      <!-- Status Filter -->
      <div>
        <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
        <select
          id="status"
          v-model="filters.status"
          class="mt-1 block w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2.5 transition-all duration-200"
        >
          <option :value="null">All</option>
          <option :value="1">In Review</option>
          <option :value="2">To Do</option>
          <option :value="3">In Progress</option>
        </select>
      </div>

      <!-- Sort By Filter -->
      <div>
        <label for="softBy" class="block text-sm font-medium text-gray-700">Sort By</label>
        <select
          id="softBy"
          v-model="filters.softBy"
          class="mt-1 block w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2.5 transition-all duration-200"
        >
          <option value="0">None</option>
          <option value="1">Name (A-Z)</option>
          <option value="2">Name (Z-A)</option>
          <option value="3">Created (Oldest)</option>
          <option value="4">Created (Newest)</option>
          <option value="5">Updated (Oldest)</option>
          <option value="6">Updated (Newest)</option>
        </select>
      </div>

      <!-- Archived Checkbox -->
      <div class="flex items-center sm:col-span-2 lg:col-span-1">
        <input
          id="archived"
          type="checkbox"
          v-model="filters.isArchived"
          class="h-4 w-4 text-indigo-600 border-gray-200 rounded focus:ring-indigo-500"
        />
        <label for="archived" class="ml-2 text-sm text-gray-700">Show Archived</label>
      </div>

      <!-- Filter Actions -->
      <div class="flex space-x-3 sm:col-span-2 lg:col-span-1">
        <button
          @click="clearFilters"
          class="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
        >
          Clear
        </button>
        <button
          @click="applyFilters"
          class="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
        >
          Apply Filters
        </button>
      </div>
    </div>
  </div>

  <!-- Step Header -->
  <div class="bg-white shadow-sm rounded-lg p-6 border border-gray-100">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <div class="flex items-center gap-2">
          <h1 class="text-2xl font-bold text-gray-900">Step: {{ step?.name }}</h1>
          <button
            @click="toggleNotification"
            class="text-gray-500 hover:text-indigo-600 transition-colors duration-200"
            aria-label="Toggle notifications"
          >
            <component :is="notification ? BellIcon : BellSlashIcon" class="h-6 w-6" />
          </button>
        </div>
        <p class="mt-2 text-sm text-gray-600">{{ step?.description || 'No description provided' }}</p>
      </div>
      <div class="flex items-center gap-2">
        <span
          :class="{
            'bg-green-100 text-green-800': step?.status_id === 1,
            'bg-yellow-100 text-yellow-800': step?.status_id === 2,
            'bg-blue-100 text-blue-800': step?.status_id === 3,
            'bg-gray-100 text-gray-800': step?.status_id === 4,
          }"
          class="px-3 py-1 text-xs font-medium rounded-full"
        >
          {{ getStatusText(step?.status_id) }}
        </span>
      </div>
    </div>
    <div class="mt-6 flex flex-wrap gap-3">
      <router-link
        :to="`/projects/${step?.project_id}`"
        class="px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors duration-200"
      >
        Back to Project
      </router-link>
      <router-link
        :to="`/manage/steps/${step?.id}`"
        class="px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors duration-200"
      >
        Manage Permissions
      </router-link>
      <button
        @click="showCreateTaskModal = true"
        class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
      >
        Add Task
      </button>
      <button
        v-for="action in stepAction"
        :key="action.label"
        @click="openConfirmDialog(action.status)"
        :class="action.class"
        class="px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
      >
        {{ action.label }}
      </button>
    </div>
  </div>

  <!-- Tasks List -->
  <div class="space-y-4">
    <h3 class="text-lg font-semibold text-gray-900">Tasks</h3>
    <div
      v-for="task in taskStore.tasks"
      :key="task.id"
      class="bg-white rounded-lg shadow-sm p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
    >
      <div class="flex justify-between items-start">
        <div class="flex gap-4">
          <div>
            <h2 class="text-lg font-semibold text-gray-900 truncate">{{ task.name }}</h2>
            <p class="mt-1 text-sm text-gray-600 line-clamp-2">{{ task.description || 'No description' }}</p>
          </div>
        </div>
        <div class="flex space-x-2">
          <button
            @click="editTask(task)"
            class="text-gray-400 hover:text-indigo-600 transition-colors duration-200"
            aria-label="Edit task"
          >
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
              />
            </svg>
          </button>
        </div>
      </div>
      <div class="mt-4 flex justify-between items-center">
        <div class="flex items-center gap-2">
          <span
            :class="{
              'bg-green-100 text-green-800': task.status_id === 1,
              'bg-yellow-100 text-yellow-800': task.status_id === 2,
              'bg-blue-100 text-blue-800': task.status_id === 3,
              'bg-gray-100 text-gray-800': task.status_id === 4,
            }"
            class="px-3 py-1 text-xs font-medium rounded-full"
          >
            {{ getStatusText(task.status_id) }}
          </span>
        </div>
        <router-link
          :to="`/tasks/${task.id}`"
          class="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
        >
          View Details →
        </router-link>
      </div>
    </div>
  </div>

  <!-- Comment Section -->
  <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mt-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Comments</h3>
    <div class="flex items-center gap-3 mb-4">
      <input
        v-model="newComment"
        type="text"
        placeholder="Add a comment..."
        class="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
      />
      <button
        @click="addComment(step?.id || 1)"
        class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
      >
        Send
      </button>
    </div>
    <ul v-if="comments.length" class="space-y-3">
      <li
        v-for="(comment, index) in comments"
        :key="index"
        class="bg-gray-50 p-4 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
      >
        <div v-if="editingCommentId !== comment.id" class="flex gap-4">
          <div class="flex-shrink-0">
            <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
              {{ comment?.User.name.charAt(0).toUpperCase() }}
            </div>
          </div>
          <div class="flex-1">
            <div class="flex justify-between items-center">
              <p class="text-sm font-medium text-gray-900">{{ comment?.User.name }}</p>
              <span class="text-xs text-gray-500">
                {{ new Date(comment.created_at).toLocaleString() }}
              </span>
            </div>
            <p class="mt-1 text-sm text-gray-600">{{ comment?.content }}</p>
            <div class="mt-2 flex gap.ConcurrentLinkedQueue3">
              <button
                @click="startEditing(comment)"
                class="text-sm text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
              >
                Edit
              </button>
              <button
                @click="deleteComment(comment.id)"
                class="text-sm text-red-600 hover:text-red-700 transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
        <div v-else class="space-y-2">
          <input
            v-model="editedContent"
            type="text"
            class="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
          />
          <div class="flex gap-3">
            <button
              @click="saveCommentEdit(comment.id)"
              class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
            >
              Save
            </button>
            <button
              @click="cancelEdit"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </li>
    </ul>
    <div v-else class="text-center py-6 bg-gray-50 rounded-lg">
      <p class="text-sm text-gray-500">No comments yet. Be the first to comment!</p>
    </div>
  </div>

  <!-- Empty State -->
  <div v-if="!loading && taskStore.tasks.length === 0" class="text-center py-16 bg-gray-50 rounded-lg">
    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
      />
    </svg>
    <h3 class="mt-2 text-lg font-semibold text-gray-900">No Tasks Found</h3>
    <p class="mt-1 text-sm text-gray-500">Get started by creating a new task or adjusting your filters.</p>
    <button
      @click="showCreateTaskModal = true"
      class="mt-6 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
    >
      <svg class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
      New Task
    </button>
  </div>

  <!-- Loading State -->
  <div v-else-if="loading" class="text-center py-16">
    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-600 mx-auto"></div>
    <p class="mt-4 text-sm text-gray-600">Loading tasks...</p>
  </div>

  <!-- Pagination -->
  <div v-if="taskStore.tasks.length > 0" class="mt-6 flex justify-center space-x-3">
    <button
      @click="prevPage"
      :disabled="currentPage === 1"
      class="px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
    >
      Previous
    </button>
    <span class="flex items-center text-sm text-gray-700">Page {{ currentPage }}</span>
    <button
      @click="nextPage"
      class="px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
    >
      Next
    </button>
  </div>

  <!-- Confirm Dialog -->
  <transition name="modal">
    <div v-if="showConfirmDialog" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full transform transition-all duration-300 scale-100">
        <div class="p-6">
          <h2 class="text-lg font-semibold text-gray-900">Confirm Status Change</h2>
          <p class="mt-2 text-sm text-gray-600">
            Are you sure you want to change the step status to
            <strong>{{ getStatusText(confirmStatus || 1) }}</strong>?
          </p>
          <div class="mt-6 flex justify-end gap-3">
            <button
              @click="showConfirmDialog = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              v-if="confirmStatus !== 4"
              @click="confirmChangeStatus"
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              Confirm
            </button>
            <button
              v-else
              @click="confirmChangeArchived"
              class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>

  <!-- Create/Edit Task Modal -->
  <transition name="modal">
    <div v-if="showCreateTaskModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full transform transition-all duration-300 scale-100">
        <div class="px-6 py-5">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ editingTask ? 'Edit Task' : 'Create Task' }}
          </h3>
          <form @submit.prevent="handleSubmit" class="mt-4 space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">Task Name</label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                class="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
              />
            </div>
            <div>
              <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                v-model="form.description"
                rows="4"
                class="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
              ></textarea>
            </div>
            <div class="flex justify-end space-x-3">
              <button
                type="button"
                @click="showCreateTaskModal = false"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                {{ editingTask ? 'Update' : 'Create' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStepStore } from '@/stores/step'
import { useTaskStore } from '@/stores/task'
import type { Task } from '@/stores/step'
import { useToast } from 'vue-toastification'
import { BellIcon, BellSlashIcon } from '@heroicons/vue/24/outline'

const toast = useToast()
const route = useRoute()
const stepStore = useStepStore()
const taskStore = useTaskStore()

const step = computed(() => stepStore.currentStep)
const loading = computed(() => stepStore.loading || taskStore.loading)
const comments = computed(() => stepStore.comments)
const notification = computed(() => stepStore.notification)

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

const stepId = Number(route.params.id)

onMounted(async () => {
  await Promise.all([
    stepStore.fetchStep(stepId),
    taskStore.fetchFilteredTasks({
      name: filters.value.name,
      startTime: filters.value.startTime || undefined,
      endTime: filters.value.endTime || undefined,
      status: filters.value.status || 0,
      isArchived: filters.value.isArchived,
      soft_by: filters.value.softBy,
      page: currentPage.value,
      limit: limit.value,
      step_id: stepId,
    }),
    stepStore.fetchCommentForStep(stepId),
  ])
})

const getStatusText = (statusId?: number) => {
  switch (statusId) {
    case 1: return 'In Review'
    case 2: return 'To Do'
    case 3: return 'In Progress'
    case 4: return 'Archived'
    default: return 'Unknown'
  }
}

const stepAction = computed(() => {
  if (!step?.value?.status_id) return []
  switch (step.value.status_id) {
    case 1: // In Review
      return [
        { label: 'Mark as Archived', status: 4, class: 'text-white bg-red-600 hover:bg-red-700' },
        { label: 'Mark as In Progress', status: 3, class: 'text-white bg-indigo-600 hover:bg-indigo-700' },
        { label: 'Mark as To Do', status: 2, class: 'text-white bg-indigo-600 hover:bg-indigo-700' },
      ]
    case 2: // To Do
      return [
        { label: 'Mark as Archived', status: 4, class: 'text-white bg-red-600 hover:bg-red-700' },
        { label: 'Mark as In Review', status: 1, class: 'text-white bg-indigo-600 hover:bg-indigo-700' },
        { label: 'Mark as In Progress', status: 3, class: 'text-white bg-indigo-600 hover:bg-indigo-700' },
      ]
    case 3: // In Progress
      return [
        { label: 'Mark as Archived', status: 4, class: 'text-white bg-red-600 hover:bg-red-700' },
        { label: 'Mark as In Review', status: 1, class: 'text-white bg-indigo-600 hover:bg-indigo-700' },
        { label: 'Mark as To Do', status: 2, class: 'text-white bg-indigo-600 hover:bg-indigo-700' },
      ]
    default:
      return []
  }
})

const toggleNotification = async () => {
  const res = await stepStore.ToggleNotification(stepId, !notification.value)
  if (res.status) {
    toast.success('Notification updated!')
    await stepStore.fetchStep(stepId)
  } else {
    toast.error(res.msg || 'Failed to update notification')
  }
}

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
      step_id: stepId,
    })
  } catch (error) {
    console.error('Error while applying filters:', error)
    toast.error('Failed to apply filters')
  }
}

const clearFilters = () => {
  filters.value = {
    name: '',
    startTime: '',
    endTime: '',
    status: null,
    isArchived: false,
    softBy: 0,
  }
  currentPage.value = 1
  applyFilters()
}

const handleSubmit = async () => {
  if (!form.value.name.trim()) {
    toast.error('Task name cannot be empty')
    return
  }
  try {
    if (editingTask.value) {
      const res = await taskStore.updateTask(editingTask.value.id, form.value)
      if (res.status) {
        await taskStore.fetchFilteredTasks({
          name: filters.value.name,
          startTime: filters.value.startTime || undefined,
          endTime: filters.value.endTime || undefined,
          status: filters.value.status || 0,
          isArchived: filters.value.isArchived,
          soft_by: filters.value.softBy,
          page: currentPage.value,
          limit: limit.value,
          step_id: stepId,
        })
        toast.success('Task updated successfully!')
      } else {
        toast.error(res.msg || 'Failed to update task')
      }
    } else {
      const res = await taskStore.createTask({
        ...form.value,
        step_id: stepId,
        priority: 0,
        assigner: 0,
      })
      if (res.status) {
        toast.success('Task created successfully!')
        await taskStore.fetchFilteredTasks({
          name: filters.value.name,
          startTime: filters.value.startTime || undefined,
          endTime: filters.value.endTime || undefined,
          status: filters.value.status || 0,
          isArchived: filters.value.isArchived,
          soft_by: filters.value.softBy,
          page: currentPage.value,
          limit: limit.value,
          step_id: stepId,
        })
      } else {
        toast.error(res.msg || 'Failed to create task')
      }
    }
    showCreateTaskModal.value = false
    form.value = { name: '', description: '' }
    editingTask.value = null
  } catch (error) {
    console.error('Failed to save task:', error)
    toast.error('An error occurred while saving the task')
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


const addComment = async (id: number) => {
  const comment = newComment.value?.trim()
  if (!comment) {
    toast.error('Comment cannot be empty')
    return
  }
  const res = await stepStore.createComment(id, comment)
  if (res.status) {
    await stepStore.fetchCommentForStep(step.value?.id || -1)
    newComment.value = ''
    toast.success('Comment added successfully!')
  } else {
    toast.error(res.msg || 'Failed to add comment')
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
  if (!editedContent.value.trim()) {
    toast.error('Comment cannot be empty')
    return
  }
  const res = await stepStore.updateComment(commentId, editedContent.value.trim())
  if (res.status) {
    await stepStore.fetchCommentForStep(step.value?.id || -1)
    cancelEdit()
    toast.success('Comment updated successfully!')
  } else {
    toast.error(res.msg || 'Failed to update comment')
  }
}

const deleteComment = async (commentId: number) => {
  if (!confirm('Are you sure you want to delete this comment?')) return
  try {
    const res = await stepStore.deleteComment(commentId)
    if (res.status) {
      await stepStore.fetchCommentForStep(step.value?.id || -1)
      toast.success('Comment deleted successfully!')
    } else {
      toast.error(res.msg || 'Failed to delete comment')
    }
  } catch (error) {
    console.error('Failed to delete comment:', error)
    toast.error('An error occurred while deleting the comment')
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
    if (res.status) {
      await stepStore.fetchStep(step.value.id)
      toast.success('Status updated successfully!')
    } else {
      toast.error(res.msg || 'Failed to update status')
    }
  } catch (err) {
    console.error('Failed to update step status:', err)
    toast.error('An error occurred while updating the status')
  } finally {
    showConfirmDialog.value = false
    confirmStatus.value = null
  }
}

const confirmChangeArchived = async () => {
  if (!step.value || confirmStatus.value === null) return
  try {
    const res = await stepStore.updateStepArchived(step.value.id)
    if (res.status) {
      await stepStore.fetchStep(step.value.id)
      toast.success('Step archived successfully!')
    } else {
      toast.error(res.msg || 'Failed to archive step')
    }
  } catch (err) {
    console.error('Failed to archive step:', err)
    toast.error('An error occurred while archiving the step')
  } finally {
    showConfirmDialog.value = false
    confirmStatus.value = null
  }
}

watch(filters, () => {
  currentPage.value = 1
  taskStore.fetchFilteredTasks({
    name: filters.value.name,
    startTime: filters.value.startTime || undefined,
    endTime: filters.value.endTime || undefined,
    status: filters.value.status || 0,
    isArchived: filters.value.isArchived,
    soft_by: filters.value.softBy,
    page: currentPage.value,
    limit: limit.value,
    step_id: stepId,
  })
}, { deep: true })

const nextPage = () => {
  currentPage.value++
  taskStore.fetchFilteredTasks({
    name: filters.value.name,
    startTime: filters.value.startTime || undefined,
    endTime: filters.value.endTime || undefined,
    status: filters.value.status || 0,
    isArchived: filters.value.isArchived,
    soft_by: filters.value.softBy,
    page: currentPage.value,
    limit: limit.value,
    step_id: stepId,
  })
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    taskStore.fetchFilteredTasks({
      name: filters.value.name,
      startTime: filters.value.startTime || undefined,
      endTime: filters.value.endTime || undefined,
      status: filters.value.status || 0,
      isArchived: filters.value.isArchived,
      soft_by: filters.value.softBy,
      page: currentPage.value,
      limit: limit.value,
      step_id: stepId,
    })
  }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>