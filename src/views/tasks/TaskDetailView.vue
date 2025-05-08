<template>
  <div class="space-y-6">
    <!-- Task Header -->
    <div class="bg-white shadow-sm rounded-lg p-6 border border-gray-100">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-2xl font-bold text-gray-900">Task: {{ task?.name }}</h1>
            <button
              @click="toggleNotification"
              class="text-gray-500 hover:text-indigo-600 transition-colors duration-200"
              aria-label="Toggle notifications"
            >
              <component :is="notification ? BellIcon : BellSlashIcon" class="h-6 w-6" />
            </button>
          </div>
          <p class="mt-2 text-sm text-gray-600">{{ task?.description || 'No description provided' }}</p>
        </div>
        <div class="flex items-center gap-2">
          <span
            :class="{
              'bg-green-100 text-green-800': task?.status_id === 1,
              'bg-yellow-100 text-yellow-800': task?.status_id === 2,
              'bg-blue-100 text-blue-800': task?.status_id === 3,
              'bg-gray-100 text-gray-800': task?.status_id === 4,
            }"
            class="px-3 py-1 text-xs font-medium rounded-full"
          >
            {{ getStatusText(task?.status_id) }}
          </span>
        </div>
      </div>
      <div v-if="taskActions.length" class="mt-6 flex flex-wrap gap-3">
        <router-link
          :to="`/steps/${task?.step_id}`"
          class="px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors duration-200"
        >
          Back to Step
        </router-link>
        <router-link
          :to="`/manage/tasks/${task?.id}`"
          class="px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors duration-200"
        >
          Manage Permissions
        </router-link>
        <button
          v-for="action in taskActions"
          :key="action.label"
          @click="openConfirmDialog(action.status)"
          :class="action.class"
          class="px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
        >
          {{ action.label }}
        </button>
      </div>
    </div>

    <!-- Assigner Selector -->
    <div class="flex flex-col sm:flex-row sm:items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <label class="text-sm font-medium text-gray-700">Assigner:</label>
      <select
        v-model="selectedAssigner"
        class="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
      >
        <option :value="0">Select an Assigner</option>
        <option v-for="user in userStepRole" :key="user.user_id" :value="user.user_id">
          {{ user.username }}
        </option>
      </select>
      <button
        @click="setAssigner(selectedAssigner)"
        class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
      >
        Assign
      </button>
    </div>

    <!-- Priority Selector -->
    <div class="flex flex-col sm:flex-row sm:items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <label class="text-sm font-medium text-gray-700">Priority:</label>
      <select
        v-model="selectedPriority"
        class="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
      >
        <option value="0">Low</option>
        <option value="1">Medium</option>
        <option value="2">High</option>
      </select>
      <button
        @click="setPriority(selectedPriority)"
        class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
      >
        Set Priority
      </button>
    </div>

    <!-- Comment Input -->
    <div class="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <input
        v-model="newComment"
        type="text"
        placeholder="Add a comment..."
        class="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
      />
      <button
        @click="addComment(task?.id || 1)"
        class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
      >
        Send
      </button>
    </div>

    <!-- Comment List -->
    <div class="space-y-3">
      <h3 class="text-lg font-semibold text-gray-900">Comments</h3>
      <ul v-if="taskStore.comment.length" class="space-y-3">
        <li
          v-for="(comment, index) in taskStore.comment"
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
              <div class="mt-2 flex gap-3">
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

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-16">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-600 mx-auto"></div>
      <p class="mt-4 text-sm text-gray-600">Loading task details...</p>
    </div>

    <!-- Confirm Dialog -->
    <transition name="modal">
      <div v-if="showConfirmDialog" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full transform transition-all duration-300 scale-100">
          <div class="p-6">
            <h2 class="text-lg font-semibold text-gray-900">Confirm Status Change</h2>
            <p class="mt-2 text-sm text-gray-600">
              Are you sure you want to change the status to
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
                class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useTaskStore } from '@/stores/task'
import { useToast } from 'vue-toastification'
import { useUserRoleStore } from '@/stores/userRole'
import { BellIcon, BellSlashIcon } from '@heroicons/vue/24/outline'

const toast = useToast()
const route = useRoute()
const taskStore = useTaskStore()
const userRoleStore = useUserRoleStore()

const task = computed(() => taskStore.currentTask)
const loading = computed(() => taskStore.loading)
const userStepRole = computed(() => userRoleStore.userStepRole)
const notification = computed(() => taskStore.notification)

const showConfirmDialog = ref(false)
const confirmStatus = ref<number | null>(null)
const newComment = ref<string>('')
const editingCommentId = ref<number | null>(null)
const editedContent = ref('')
const selectedAssigner = ref<number>(0)
const selectedPriority = ref<number>(0)

const taskId = Number(route.params.id)

onMounted(async () => {
  await Promise.all([
    taskStore.fetchTask(taskId),
    taskStore.fetchComment(taskId),
    userRoleStore.fetchUsersRoleTask(taskId),
  ])
})

watchEffect(() => {
  if (task.value?.priority !== undefined) {
    selectedPriority.value = task.value.priority
  }
  if (task.value?.assigner !== undefined) {
    selectedAssigner.value = task.value.assigner
  }
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

const taskActions = computed(() => {
  if (!task?.value?.status_id) return []
  switch (task.value.status_id) {
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
  const res = await taskStore.ToggleNotification(taskId, !notification.value)
  if (res.status) {
    toast.success('Notification updated!')
    await taskStore.fetchTask(taskId)
  } else {
    toast.error(res.msg || 'Failed to update notification')
  }
}

const openConfirmDialog = (status: number) => {
  confirmStatus.value = status
  showConfirmDialog.value = true
}

const confirmChangeStatus = async () => {
  if (!task.value || confirmStatus.value === null) return
  try {
    const res = await taskStore.updateTaskStatus(task.value.id, confirmStatus.value)
    if (res.status) {
      await taskStore.fetchTask(task.value.id)
      toast.success('Status updated successfully!')
    } else {
      toast.error(res.msg || 'Failed to update status')
    }
  } catch (err) {
    console.error('Failed to update task status:', err)
    toast.error('An error occurred while updating the status')
  } finally {
    showConfirmDialog.value = false
    confirmStatus.value = null
  }
}

const confirmChangeArchived = async () => {
  if (!task.value || confirmStatus.value === null) return
  try {
    const res = await taskStore.updateTaskArchived(task.value.id)
    if (res.status) {
      await taskStore.fetchTask(task.value.id)
      toast.success('Task archived successfully!')
    } else {
      toast.error(res.msg || 'Failed to archive task')
    }
  } catch (err) {
    console.error('Failed to archive task:', err)
    toast.error('An error occurred while archiving the task')
  } finally {
    showConfirmDialog.value = false
    confirmStatus.value = null
  }
}

const setAssigner = async (userId: number) => {
  if (!userId) {
    toast.error('Please select an assigner')
    return
  }
  const res = await taskStore.setAssigner(userId, taskId)
  if (res.status) {
    toast.success('Assigner updated successfully!')
    await taskStore.fetchTask(taskId)
  } else {
    toast.error(res.msg || 'Failed to update assigner')
  }
}

const setPriority = async (priority: number) => {
  const res = await taskStore.setPriority(priority, taskId)
  if (res.status) {
    toast.success('Priority updated successfully!')
    await taskStore.fetchTask(taskId)
  } else {
    toast.error(res.msg || 'Failed to update priority')
  }
}

const addComment = async (id: number) => {
  const comment = newComment.value?.trim()
  if (!comment) {
    toast.error('Comment cannot be empty')
    return
  }
  const res = await taskStore.createComment(id, comment)
  if (res.status) {
    newComment.value = ''
    toast.success('Comment added successfully!')
    await taskStore.fetchComment(id)
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
  const res = await taskStore.updateComment(commentId, {
    content: editedContent.value.trim(),
  })
  if (res.status) {
    await taskStore.fetchComment(task?.value?.id || 0)
    cancelEdit()
    toast.success('Comment updated successfully!')
  } else {
   toast.error(res.msg || 'Failed to update comment')
  }
}

const deleteComment = async (commentId: number) => {
  if (!confirm('Are you sure you want to delete this comment?')) return
  try {
    const res = await taskStore.deleteComment(commentId)
    if (res.status) {
      await taskStore.fetchComment(task?.value?.id || 0)
      toast.success('Comment deleted successfully!')
    } else {
      toast.error(res.msg || 'Failed to delete comment')
    }
  } catch (error) {
    console.error('Failed to delete comment:', error)
    toast.error('An error occurred while deleting the comment')
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