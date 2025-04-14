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
        @click="addComment(task.id)"
        class="px-2 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
        Gửi
        </button>
    </div>
    <!-- Danh sách comment -->
    <ul class="text-sm text-gray-700 space-y-1">
        <li v-for="comment in taskStore.comment" :key="index">
        Account: {{ comment?.user_id }}<br />
        Nội dung:   {{ comment?.content }}
        </li>
    </ul>
    
  
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
      </div>
  
      
        <!-- Confirm Dialog -->
        <div v-if="showConfirmDialog" class="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
            <div class="bg-white rounded-md shadow p-6 w-full max-w-sm">
                <h2 class="text-lg font-semibold mb-4">Xác nhận thay đổi trạng thái</h2>
                <p class="text-sm text-gray-700 mb-6">Bạn có chắc muốn chuyển task sang trạng thái "<strong>{{ getStatusText(confirmStatus) }}</strong>" không?</p>
                <div class="flex justify-end space-x-3">
                <button
                    @click="showConfirmDialog = false"
                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100"
                >
                    Huỷ
                </button>
                <button
                    @click="confirmChangeStatus"
                    class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700"
                >
                    Xác nhận
                </button>
            </div>
        </div>
        </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { useStepStore } from '@/stores/step'
  import { useTaskStore } from  '@/stores/task'
  import type { Task } from '@/stores/step'
  
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
        await taskStore.updateTaskStatus(task.value.id, confirmStatus.value)
        console.log(confirmStatus.value)
        await taskStore.fetchTask(task.value.id) // Refresh lại task
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
      default:
        return 'Unknown'
    }
  }
  
  const handleSubmit = async () => {
    try {
      if (editingTask.value) {
        await taskStore.updateTask(editingTask.value.id, form.value)
      } else {
        await taskStore.createTask({
          ...form.value,
          step_id: Number(route.params.id),
        })
        
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
  
  const toggleTaskStatus = async (task: Task) => {
    try {
      const newStatus = task.status_id === 0 ? 1 : 0
      await stepStore.updateTaskStatus(task.id, newStatus)
    } catch (error) {
      console.error('Failed to update task status:', error)
    }
  }
  
  const editStep = () => {
    // TODO: Implement step editing
  }
  </script>
  