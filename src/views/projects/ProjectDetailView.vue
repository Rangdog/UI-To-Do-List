<template>
  <!-- Filters Section -->
  <div class="flex flex-col sm:flex-row sm:items-end gap-4 bg-white p-6 rounded-lg shadow-sm">
    <!-- Name Filter -->
    <div class="flex-1">
      <label for="filter-name" class="block text-sm font-semibold text-gray-800">Step Name</label>
      <input id="filter-name" v-model="filters.name" type="text" placeholder="Search name..."
        class="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 py-2 px-3 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200" />
    </div>

    <!-- Date Range -->
    <div>
      <label for="start-date" class="block text-sm font-semibold text-gray-800">Start Time</label>
      <input id="start-date" v-model="filters.startTime" type="date"
        class="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 py-2 px-3 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200" />
    </div>

    <div>
      <label for="end-date" class="block text-sm font-semibold text-gray-800">End Time</label>
      <input id="end-date" v-model="filters.endTime" type="date"
        class="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 py-2 px-3 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200" />
    </div>

    <!-- Status Filter Combobox -->
    <div>
      <label for="status" class="block text-sm font-semibold text-gray-800">Status</label>
      <select id="status" v-model="filters.status"
        class="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 py-2 px-3 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200">
        <option :value="null">All</option>
        <option :value="1">Success</option>
        <option :value="2">Pending</option>
        <option :value="3">Processing</option>
      </select>
    </div>

    <!-- SortBy Filter Combobox -->
    <div>
      <label for="softBy" class="block text-sm font-semibold text-gray-800">Sort by</label>
      <select id="softBy" v-model="filters.softBy"
        class="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 py-2 px-3 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200">
        <option :value="0">---</option>
        <option :value="1">Name ASC</option>
        <option :value="2">Name DESC</option>
        <option :value="3">Created ASC</option>
        <option :value="4">Created DESC</option>
        <option :value="5">Updated ASC</option>
        <option :value="6">Updated DESC</option>
      </select>
    </div>

    <!-- IsArchived Checkbox -->
    <div class="flex items-center">
      <input id="archived" type="checkbox" v-model="filters.isArchived"
        class="h-4 w-4 text-indigo-600 border-gray-200 rounded focus:ring-indigo-500" />
      <label for="archived" class="ml-2 block text-sm font-semibold text-gray-800">Archived</label>
    </div>

    <!-- Apply Filter Button -->
    <div>
      <button @click="applyFilters"
        class="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-lg hover:from-indigo-700 hover:to-indigo-800 shadow-md transition-all duration-200">
        Apply
      </button>
    </div>
  </div>

  <div class="mt-6 space-y-6">
    <!-- Project Header -->
    <div class="bg-white shadow-lg rounded-lg p-6">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 flex items-center">
            {{ project?.name }}
            <button @click="toggleNotification" class="ml-2 text-gray-500 hover:text-gray-700">
              <component :is="notification ? BellIcon : BellSlashIcon" class="h-6 w-6" />
            </button>
          </h1>
          <p class="mt-2 text-sm text-gray-600">Description: {{ project?.description }}</p>
        </div>
        <div class="flex space-x-4">
          <router-link :to="`/manage/projects/${project?.id}`"
            class="px-4 py-2 text-sm font-semibold text-indigo-600 bg-white border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-all duration-200">
            Manage Permission
          </router-link>
          <button @click="showCreateStepModal = true"
            class="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-lg hover:from-indigo-700 hover:to-indigo-800 shadow-md transition-all duration-200">
            Add Step
          </button>
        </div>
      </div>
    </div>

    <!-- Steps List -->
    <div class="space-y-4">
      <div v-for="step in steps" :key="step.id"
        class="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-all duration-200">
        <div class="flex justify-between items-start">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">{{ step.name }}</h2>
            <p class="mt-2 text-sm text-gray-600">{{ step.description }}</p>
          </div>
          <div class="flex space-x-2">
            <button @click="editStep(step)" class="text-gray-400 hover:text-gray-600">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
          </div>
        </div>
        <div class="mt-4 flex justify-between items-center">
          <div class="flex items-center space-x-2">
            <span :class="{
              'bg-green-100 text-green-800': step.status_id === 1,
              'bg-yellow-100 text-yellow-800': step.status_id === 2,
              'bg-blue-100 text-blue-800': step.status_id === 3,
            }" class="px-2 py-1 text-xs font-medium rounded-full">
              {{ getStatusText(step.status_id) }}
            </span>
            <span class="text-sm text-gray-600">{{ step?.Amount }} tasks</span>
          </div>
          <router-link :to="`/steps/${step.id}`"
            class="text-sm font-semibold text-indigo-600 hover:text-indigo-500 transition-all duration-200">
            View Details →
          </router-link>
        </div>
        <!-- COMMENT SECTION -->
        <div class="mt-4">
          <button @click="toggleComments(step.id)"
            class="text-sm font-semibold text-indigo-600 hover:text-indigo-500 transition-all duration-200">
            {{ expandedSteps[step.id] ? 'Collapse' : 'Expand...' }}
          </button>

          <div v-if="expandedSteps[step.id]" class="mt-4 space-y-4">
            <!-- Comment List -->
            <ul class="text-sm text-gray-700 space-y-3">
              <li v-for="(comment, index) in stepComments[step.id]" :key="comment.id"
                class="bg-gray-50 p-3 rounded-lg shadow-sm">
                <div v-if="editingCommentId !== comment.id">
                  <div class="flex-shrink-0">
                    <div
                      class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                      {{ comment?.User.name.charAt(0).toUpperCase() }}
                    </div>
                  </div>
                  <p><strong class="text-gray-800">Account:</strong> {{ comment.User.username }}</p>
                  <p><strong class="text-gray-800">Content:</strong> {{ comment.content }}</p>
                  <div class="flex space-x-3 mt-2">
                    <button @click="startEditing(comment)"
                      class="text-sm text-indigo-600 hover:text-indigo-500 font-semibold">
                      Edit
                    </button>
                    <button @click="deleteComment(comment.id, step.id)"
                      class="text-sm text-red-600 hover:text-red-500 font-semibold">
                      Delete
                    </button>
                  </div>
                </div>

                <div v-else class="space-y-2">
                  <input v-model="editedContent" type="text"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:ring-indigo-500 focus:border-indigo-500" />
                  <div class="flex space-x-3 mt-2">
                    <button @click="saveCommentEdit(comment.id, step.id)"
                      class="px-3 py-1 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700">
                      Save
                    </button>
                    <button @click="cancelEdit"
                      class="px-3 py-1 text-sm font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-200">
                      Cancel
                    </button>
                  </div>
                </div>
              </li>
            </ul>

            <!-- Comment Input -->
            <div class="flex items-center space-x-3 mt-4">
              <input v-model="newComment[step.id]" type="text" placeholder="Enter comment..."
                class="flex-1 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:ring-indigo-500 focus:border-indigo-500" />
              <button @click="addComment(step.id)"
                class="px-3 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && steps.length === 0" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <h3 class="mt-2 text-lg font-semibold text-gray-900">No steps</h3>
      <p class="mt-1 text-sm text-gray-600">Get started by creating a new step.</p>
      <div class="mt-6">
        <button @click="showCreateStepModal = true"
          class="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-lg hover:from-indigo-700 hover:to-indigo-800 shadow-md transition-all duration-200">
          <svg class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Step
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
    </div>

    <!-- Pagination -->
    <div class="mt-6 flex justify-center space-x-3">
      <button @click="prevPage"
        class="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all duration-200">
        Prev
      </button>
      <span class="text-sm font-semibold text-gray-800">Page {{ currentPage }}</span>
      <button @click="nextPage"
        class="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all duration-200">
        Next
      </button>
    </div>

    <!-- Create/Edit Step Modal -->
    <div v-if="showCreateStepModal"
      class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 transition-opacity duration-300">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full transform transition-all duration-300 scale-100">
        <div class="px-6 py-5 sm:p-8">
          <h3 class="text-xl font-bold text-gray-900">
            {{ editingStep ? 'Edit Step' : 'Create Step' }}
          </h3>
          <form @submit.prevent="handleSubmit" class="mt-6 space-y-6">
            <div>
              <label for="name" class="block text-sm font-semibold text-gray-800">Step Name</label>
              <input id="name" v-model="form.name" type="text" required
                class="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 py-2 px-3 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200" />
            </div>
            <div>
              <label for="description" class="block text-sm font-semibold text-gray-800">Description</label>
              <textarea id="description" v-model="form.description" rows="4"
                class="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 py-2 px-3 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"></textarea>
            </div>
            <div class="flex justify-end space-x-4">
              <button type="button" @click="showCreateStepModal = false"
                class="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200">
                Cancel
              </button>
              <button type="submit"
                class="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-lg hover:from-indigo-700 hover:to-indigo-800 shadow-md transition-all duration-200">
                {{ editingStep ? 'Update' : 'Create' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useProjectStore } from '@/stores/project'
import { useStepStore } from '@/stores/step'
import type { Step } from '@/stores/step'
import { useToast } from 'vue-toastification'
import { BellIcon, BellSlashIcon } from '@heroicons/vue/24/outline'

const toast = useToast()
const route = useRoute()
const projectStore = useProjectStore()
const stepStore = useStepStore()

const project = computed(() => projectStore.currentProject)
const steps = computed(() => stepStore.steps)
const loading = computed(() => stepStore.loading)
const notification = computed(() => projectStore.notification)

const showCreateStepModal = ref(false)
const editingStep = ref<Step | null>(null)

const form = ref({
  name: '',
  description: '',
})

const currentPage = ref(1)
const limit = ref(5)
const filters = ref({
  name: '',
  startTime: '',
  endTime: '',
  status: null as number | null,
  isArchived: false,
  softBy: 0,
})

const toggleNotification = async () => {
  const res = await projectStore.ToggleNotification(projectId, !notification.value)
  if (res?.status) {
    toast.success('Notification Changed!')
    await projectStore.fetchProject(projectId)
  } else {
    toast.error(res.msg + '!')
  }
}

const applyFilters = async () => {
  try {
    await stepStore.fetchFilteredSteps({
      name: filters.value.name,
      startTime: filters.value.startTime || undefined,
      endTime: filters.value.endTime || undefined,
      status: filters.value.status || 0,
      isArchived: filters.value.isArchived,
      softBy: filters.value.softBy,
      page: currentPage.value,
      limit: limit.value,
      project_id: projectId,
    })
  } catch (error) {
    console.error('Error while applying filters:', error)
  }
}

watch(
  filters,
  () => {
    currentPage.value = 1
    stepStore.fetchFilteredSteps({
      name: filters.value.name,
      startTime: filters.value.startTime || undefined,
      endTime: filters.value.endTime || undefined,
      status: filters.value.status || 0,
      isArchived: filters.value.isArchived,
      softBy: filters.value.softBy,
      page: currentPage.value,
      limit: limit.value,
      project_id: projectId,
    })
  },
  { deep: true }
)

const nextPage = () => {
  currentPage.value++
  stepStore.fetchFilteredSteps({
    name: filters.value.name,
    startTime: filters.value.startTime || undefined,
    endTime: filters.value.endTime || undefined,
    status: filters.value.status || 0,
    isArchived: filters.value.isArchived,
    softBy: filters.value.softBy,
    page: currentPage.value,
    limit: limit.value,
    project_id: projectId,
  })
}
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    stepStore.fetchFilteredSteps({
      name: filters.value.name,
      startTime: filters.value.startTime || undefined,
      endTime: filters.value.endTime || undefined,
      status: filters.value.status || 0,
      isArchived: filters.value.isArchived,
      softBy: filters.value.softBy,
      page: currentPage.value,
      limit: limit.value,
      project_id: projectId,
    })
  }
}

interface Comment {
  id: number
  content: string
  created_at: string
  updated_at: string
  user_id: number
  step_id?: number
  task_id?: number
  User?: any
}

// Lưu trạng thái mở rộng/thu gọn của từng step
const expandedSteps = reactive<Record<number, boolean>>({})

// Lưu comment nhập mới cho từng step
const newComment = reactive<Record<number, string>>({})

// Danh sách comment cho từng step
const stepComments = reactive<Record<number, Comment[]>>({})

// Toggle mở rộng/thu gọn
const toggleComments = async (stepId: number) => {
  if (!expandedSteps[stepId]) {
    expandedSteps[stepId] = true

    try {
      await stepStore.fetchComment(stepId)

      const stepIndex = steps.value.findIndex((s) => s.id === stepId)
      const step = steps.value[stepIndex]

      // map về dạng text để hiển thị demo
      stepComments[stepId] = step.comments || []
    } catch (error) {
      console.error('Failed to fetch comments:', error)
    }
  } else {
    // Nếu đang mở thì chỉ đóng lại
    expandedSteps[stepId] = false
  }
}

// Thêm comment mới
const addComment = async (stepId: number) => {
  if (!stepComments[stepId]) {
    stepComments[stepId] = []
  }

  const comment = newComment[stepId]?.trim()
  if (comment) {
    const res = await stepStore.createComment(stepId, comment)
    if (res?.status) {
      newComment[stepId] = ''
      toast.success('Added comment!')
    } else {
      toast.warning(res.msg + '!')
    }
  }
}
const projectId = Number(route.params.id)
onMounted(async () => {
  await projectStore.fetchProject(projectId)
  await stepStore.fetchFilteredSteps({
    name: filters.value.name,
    startTime: filters.value.startTime || undefined,
    endTime: filters.value.endTime || undefined,
    status: filters.value.status || 0,
    isArchived: filters.value.isArchived,
    softBy: filters.value.softBy,
    page: currentPage.value,
    limit: limit.value,
    project_id: projectId,
  })
})

const getStatusText = (statusId: number) => {
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
    if (editingStep.value) {
      const res = await stepStore.updateStep(editingStep.value.id, form.value)
      if (res.status) {
        toast.success('Updated step!')
      } else {
        toast.error(res.msg + '!')
      }
    } else {
      const res = await stepStore.createStep({
        ...form.value,
        project_id: projectId,
      })
      if (res.status) {
        toast.success('Created step!')
      } else {
        toast.error(res.msg + '!')
      }
    }
    showCreateStepModal.value = false
    form.value = { name: '', description: '' }
    editingStep.value = null
  } catch (error) {
    console.error('Failed to save step:', error)
  }
}

const editStep = (step: Step) => {
  editingStep.value = step
  form.value = {
    name: step.name,
    description: step.description,
  }
  showCreateStepModal.value = true
}

const editingCommentId = ref<number | null>(null)
const editedContent = ref('')

// Bắt đầu chỉnh sửa comment
const startEditing = (comment: any) => {
  editingCommentId.value = comment.id
  editedContent.value = comment.content
}

// Lưu chỉnh sửa comment
const saveCommentEdit = async (commentId: number, stepId: number) => {
  if (!editedContent.value.trim()) return

  const res = await stepStore.updateComment(commentId, editedContent.value)
  if (res?.status) {
    // Cập nhật trong stepComments
    const index = stepComments[stepId].findIndex((c: any) => c.id === commentId)
    if (index !== -1) {
      stepComments[stepId][index].content = editedContent.value
    }
    editingCommentId.value = null
    editedContent.value = ''
    toast.success('Edited comment!')
  } else {
    toast.error(res.msg + '!')
  }
}

// Huỷ chỉnh sửa
const cancelEdit = () => {
  editingCommentId.value = null
  editedContent.value = ''
}

// Xoá comment
const deleteComment = async (commentId: number, stepId: number) => {
  if (confirm('Are you sure you want to delete this comment?')) {
    const res = await stepStore.deleteComment(commentId)
    if (res) {
      const index = stepComments[stepId].findIndex((c: any) => c.id === commentId)
      if (index !== -1) {
        stepComments[stepId].splice(index, 1)
      }
      toast.success('Deleted comment!')
    } else {
      toast.error('Something went wrong!')
    }
  }
}
</script>