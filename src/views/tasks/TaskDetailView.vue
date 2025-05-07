<template>
  <div class="space-y-6">
    <!-- Step Header -->
    <div class="bg-white shadow rounded-lg p-6">
      <div class="flex flex-col space-y-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Task name: {{ task?.name }}
            <button @click="toggleNotification" class="ml-2">
              <component :is="notification ? BellIcon : BellSlashIcon" class="h-6 w-6" />
            </button>
          </h1>
          <p class="mt-2 text-gray-500">Description: {{ task?.description }}</p>
        </div>

        <div v-if="taskActions.length" class="flex flex-wrap gap-4 justify-between">
          <router-link :to="`/steps/${task?.step_id}`"
            class="px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-600 rounded-md hover:bg-indigo-50 inline-flex items-center justify-center">
            Back To Step
          </router-link>
          <router-link :to="`/manage/tasks/${task?.id}`"
            class="px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-600 rounded-md hover:bg-indigo-50 inline-flex items-center justify-center">
            Manage Permission
          </router-link>
          <button v-for="action in taskActions" :key="action.label" @click="openConfirmDialog(action.status)"
            :class="action.class">
            {{ action.label }}
          </button>
        </div>
      </div>
      <div class="mt-4 flex items-center space-x-2">
        <span :class="{
          'bg-green-100 text-green-800': task?.status_id === 1,
          'bg-yellow-100 text-yellow-800': task?.status_id === 2,
          'bg-blue-100 text-blue-800': task?.status_id === 3,
        }" class="px-2 py-1 text-xs font-medium rounded-full">
          {{ getStatusText(task?.status_id) }}
        </span>
      </div>
    </div>
    <div class="flex flex-wrap items-center gap-4">
      <!-- Select Box -->
      <span class="text-sm font-medium text-gray-700">Assigner:</span>
      <select v-model="selectedAssigner"
        class="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
        <option :value = 0 >Select an Assigner</option>
        <option v-for="user in userStepRole" :key="user.user_id" :value="user.user_id">
          {{ user.username }}
        </option>
      </select>

      <!-- Button -->
      <button @click="setAssigner(selectedAssigner)"
        class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
        Submit
      </button>
    </div>

    <div class="flex flex-wrap items-center gap-4">
      <!-- Select Box -->
      <span class="text-sm font-medium text-gray-700">Priority:</span>
      <select v-model="selectedPriority"
        class="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
        <option value="0">Low</option>
        <option value="1">Medium</option>
        <option value="2">High</option>
      </select>

      <!-- Button -->
      <button @click="setPriority(selectedPriority)"
        class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
        Submit
      </button>
    </div>

    <!-- Ô input và nút gửi -->
    <div class="flex items-center space-x-2 mt-2">
      <input v-model="newComment" type="text" placeholder="Comment..."
        class="flex-1 px-3 py-1 border rounded-md text-sm" />
      <button @click="addComment(task?.id || 1)"
        class="px-2 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700">
        Send
      </button>
    </div>

    <!-- Danh sách comment -->
    <ul class="text-sm text-gray-700 space-y-2 mt-2">
      <li v-for="(comment, index) in taskStore.comment" :key="index" class="bg-gray-50 p-2 rounded">
        <!-- Hiển thị bình thường -->
        <div v-if="editingCommentId !== comment.id">
          <p><strong>Account:</strong> {{ comment?.User.name }}</p>
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


    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
    </div>


    <!-- Confirm Dialog -->
    <div v-if="showConfirmDialog" class="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
      <div class="bg-white rounded-md shadow p-6 w-full max-w-sm">
        <h2 class="text-lg font-semibold mb-4">Comfirm change status</h2>
        <p class="text-sm text-gray-700 mb-6">Are you want change status "<strong>{{ getStatusText(confirmStatus || 1)
            }}</strong>"?</p>
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

const form = ref({
  name: '',
  description: '',
})
const selectedAssigner = ref()
const selectedPriority = ref(0)
const toggleNotification = async() => {
    const res = await taskStore.ToggleNotification(taskId,!notification.value)
    if (res.status){
      toast.success("Notification Changed!")
      await taskStore.fetchTask(taskId)
    }else{
      toast.error(res.msg + "!")
    }
};
watchEffect(() => {
  if (task.value?.priority !== undefined) {
    selectedPriority.value = task.value?.priority
  }
  if (task.value?.assigner !== undefined) {
    selectedAssigner.value = task.value?.assigner
  }
})
const newComment = ref<string>("")

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
      toast.success('Changed status!') // Refresh lại task
    } else {
      toast.error(res.msg + "!")
    }
  } catch (err) {
    console.error('Failed to update task status:', err)
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
      toast.success('Mark as archived!') // Refresh lại task
    } else {
      toast.error(res.msg + "!")
    }
  } catch (err) {
    console.error('Failed to update task status:', err)
  } finally {
    showConfirmDialog.value = false
    confirmStatus.value = null
  }
}


const addComment = async (id: number) => {
  const comment = newComment.value?.trim()
  const res = await taskStore.createComment(id, comment)
  if (res.status){
    newComment.value = ''
    toast.success("Created Comment")
  }else{
    toast.error(res.msg + "!")
  }
}
const taskId = Number(route.params.id)
onMounted(async () => {
  await taskStore.fetchTask(taskId)
  await taskStore.fetchComment(taskId)
  await userRoleStore.fetchUsersRoleTask(taskId)
})

const getStatusText = (statusId?: number) => {
  switch (statusId) {
    case 1:
      return 'Success'
    case 2:
      return 'Pending'
    case 3:
      return 'Processing'
    case 4:
      return 'Archived'
    default:
      return 'Unknown'
  }
}



//comment
const editingCommentId = ref<number | null>(null)
const editedContent = ref('')

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

  const res = await taskStore.updateComment(commentId, {
    content: editedContent.value.trim(),
  })

  if (res.status) {
    await taskStore.fetchComment(task?.value?.id || 0) // hoặc fetch lại nếu cần
    cancelEdit()
    toast.success('Updated comment!')
  } else {
    console.warn('Cập nhật thất bại 😢')
    toast.error(res.msg + "!")
  }
}

const deleteComment = async (commentId: number) => {
  if (confirm('Are you want delete this comment?')) {
    try {
      const res = await taskStore.deleteComment(commentId)
      
      if (res.status) {
        await taskStore.fetchComment(task?.value?.id || 0)
        toast.success('Deleted comment!')
      }
      else {
        toast.error(res.msg + "!")
      }
    } catch (error) {
      console.error('Xoá bình luận thất bại:', error)
      toast.error('Something went wrong!')
    }
  }
}
const taskActions = computed(() => {
  if (!task?.value?.status_id) return [];
  switch (task?.value.status_id) {
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

const setAssigner = async (userId: number) => {
  const res = await taskStore.setAssigner(userId, taskId)
  if (res.status){
    toast.success("Assigned!")
  }else{
    toast.error(res.msg + "!")
  }
}

const setPriority = async (priority: number) => {
  const res = await taskStore.setPriority(priority, taskId)
  if (res.status){
    toast.success("Success!")
  }else{
    toast.error(res.msg + "!")
  }
}
</script>