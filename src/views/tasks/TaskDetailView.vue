<template>
    <div class="space-y-6">
      <!-- Step Header -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex justify-between items-start">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ task?.name }}</h1>
            <p class="mt-2 text-gray-500">{{ task?.description }}</p>
          </div>
          <div class="flex space-x-4" v-if="task?.status_id === 1">
            <button
              @click="openConfirmDialog(4)"
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Mark as Archived
            </button>
            <button
              @click="openConfirmDialog(3)"
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Mark as processing
            </button>
            <button
              @click="openConfirmDialog(2)"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
                Mark as pending
            </button>
          </div>
          <div class="flex space-x-4" v-if="task?.status_id === 2">
            <button
              @click="openConfirmDialog(4)"
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Mark as Archived
            </button>

            <button
              @click="openConfirmDialog(1)"
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Mark as success
            </button>
            <button
              @click="openConfirmDialog(3)"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
                Mark as processing
            </button>
          </div>
          <div class="flex space-x-4" v-if="task?.status_id === 3">
            <button
              @click="openConfirmDialog(4)"
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Mark as Archived
            </button>

            <button
              @click="openConfirmDialog(1)"
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Mark as success
            </button>
            <button
              @click="openConfirmDialog(2)"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
                Mark as pending
            </button>
          </div>
        </div>
        <div class="mt-4 flex items-center space-x-2">
          <span
            :class="{
              'bg-green-100 text-green-800': task?.status_id === 1,
              'bg-yellow-100 text-yellow-800': task?.status_id === 2,
              'bg-blue-100 text-blue-800': task?.status_id === 3,
            }"
            class="px-2 py-1 text-xs font-medium rounded-full"
          >
            {{ getStatusText(task?.status_id) }}
          </span>
        </div>
      </div>

      <!-- Ô input và nút gửi -->
      <div class="flex items-center space-x-2 mt-2">
        <input
          v-model="newComment"
          type="text"
          placeholder="Comment..."
          class="flex-1 px-3 py-1 border rounded-md text-sm"
        />
        <button
          @click="addComment(task?.id || 1)"
          class="px-2 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Send
        </button>
      </div>

      <!-- Danh sách comment -->
      <ul class="text-sm text-gray-700 space-y-2 mt-2">
        <li
          v-for="(comment, index) in taskStore.comment"
          :key="index"
          class="bg-gray-50 p-2 rounded"
        >
          <!-- Hiển thị bình thường -->
          <div v-if="editingCommentId !== comment.id">
            <p><strong>Account:</strong> {{ comment?.user_id }}</p>
            <p><strong>Content:</strong> {{ comment?.content }}</p>
            <div class="flex space-x-3 mt-1">
              <button
                @click="startEditing(comment)"
                class="text-sm text-indigo-600 hover:underline"
              >
                Edit
              </button>
              <button
                @click="deleteComment(comment.id)"
                class="text-sm text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>

          <!-- Chế độ chỉnh sửa -->
          <div v-else class="space-y-1">
            <input
              v-model="editedContent"
              type="text"
              class="w-full px-2 py-1 border rounded-md text-sm"
            />
            <div class="flex space-x-2 mt-1">
              <button
                @click="saveCommentEdit(comment.id)"
                class="text-sm text-white bg-green-600 px-3 py-1 rounded hover:bg-green-700"
              >
                Save
              </button>
              <button
                @click="cancelEdit"
                class="text-sm text-gray-600 px-3 py-1 border rounded hover:bg-gray-200"
              >
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
                <p class="text-sm text-gray-700 mb-6">Are you want change status "<strong>{{ getStatusText(confirmStatus || 1) }}</strong>"?</p>
                <div class="flex justify-end space-x-3">
                <button
                    @click="showConfirmDialog = false"
                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100"
                >
                    Cancel
                </button>
                <div v-if="confirmStatus != 4">
                      <button
                        @click="confirmChangeStatus"
                        class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700"
                    >
                        Comfirm
                    </button>
                </div>
                <div v-else>
                      <button
                        @click="confirmChangeArchived"
                        class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700"
                    >
                        Comfirm
                    </button>
                </div>
            </div>
        </div>
        </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { useTaskStore } from  '@/stores/task'
  import { useToast } from 'vue-toastification'

  const toast = useToast()
  
  const route = useRoute()
  const taskStore = useTaskStore()
  
  const task = computed(() => taskStore.currentTask)
  const loading = computed(() => taskStore.loading)
  
  const showConfirmDialog = ref(false)
    const confirmStatus = ref<number | null>(null)
  
  const form = ref({
    name: '',
    description: '',
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
        if (res){
          await taskStore.fetchTask(task.value.id)
          toast.success('Changed status!') // Refresh lại task
        }else{
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
    if (!task.value || confirmStatus.value === null) return

    try {
        const res = await taskStore.updateTaskArchived(task.value.id, confirmStatus.value)
        if (res){
          await taskStore.fetchTask(task.value.id)
          toast.success('Mark as archived!') // Refresh lại task
        }else{
          toast.error('Something went wrong')
        }
    } catch (err) {
        console.error('Failed to update task status:', err)
    } finally {
        showConfirmDialog.value = false
        confirmStatus.value = null
    }
    }


    const addComment = async(id: number) => {
        const comment = newComment.value?.trim()
        await taskStore.createComment(id, comment)
        newComment.value = ''
    }
  
  onMounted(async () => {
    const taskId = Number(route.params.id)
    await taskStore.fetchTask(taskId)
    await taskStore.fetchComment(taskId)
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
  
  
  const editStep = () => {
    // TODO: Implement step editing
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

    if (res) {
      await taskStore.fetchComment(task?.value?.id || 0) // hoặc fetch lại nếu cần
      cancelEdit()
      toast.success('Updated comment!')
    } else {
      console.warn('Cập nhật thất bại 😢')
      toast.error('Something went wrong!')
    }
  }
  
  const deleteComment = async (commentId: number) => {
  if (confirm('Are you want delete this comment?')) {
    try {
      const res = await taskStore.deleteComment(commentId)
      if (res){
        await taskStore.fetchComment(task?.value?.id || 0) 
        toast.success('Deleted comment!')
      }
      else{
        toast.error('Something went wrong!')
      }
    } catch (error) {
      console.error('Xoá bình luận thất bại:', error)
      toast.error('Something went wrong!')
    }
  }
}

  </script>
  