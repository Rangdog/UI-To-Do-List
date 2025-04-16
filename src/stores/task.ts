import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/axios'
export interface Task {
  id: number
  name: string
  description: string
  created_at: string
  updated_at: string
  is_archived: boolean
  status_id: number
  step_id: number
  comments?: Comment[]
}

export interface Comment {
  id: number
  content: string
  created_at: string
  updated_at: string
  user_id: number
  step_id?: number
  task_id?: number
}

interface ResponseAPI {
  response_key: string
  response_message: string
  data: any
}

export const useTaskStore = defineStore('task', () => {
  const tasks = ref<Task[]>([])
  const currentTask = ref<Task | null>(null)
  const comment = ref<Comment[]>([])
  const loading = ref(false)

  // Step methods
  const fetchTasks = async (step_id: number) => {
    try {
      loading.value = true
      const response = await api.get<ResponseAPI>(`/tasks/step/${step_id}`)
      console.log(response)
      tasks.value = response?.data?.data
    } catch (error) {
      console.error('Failed to fetch steps:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchTask = async (id: number) => {
    try {
      loading.value = true
      const response = await api.get<ResponseAPI>(`/tasks/${id}`)
      currentTask.value = response?.data?.data
    } catch (error) {
      console.error('Failed to fetch step:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchComment = async(id: number) =>{
    try {
        loading.value = true
        const response = await api.get<ResponseAPI>(`/comments/task/${id}`)
        console.log(response)
        comment.value = response?.data?.data
      } catch (error) {
        console.error('Failed to fetch step:', error)
        throw error
      } finally {
        loading.value = false
      }
  }

  // Task methods
  const createTask = async (task: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'status_id' | 'is_archived'>) => {
    try {
      loading.value = true
      const response = await api.post<ResponseAPI>('/tasks', task)
      tasks.value.push(response?.data?.data)
      return response.status === 201
    } catch (error) {
      console.error('Failed to create task:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  const updateTask = async (id: number, task: Partial<Task>) => {
    try {
      loading.value = true
      const response = await api.patch<ResponseAPI>(`/tasks/${id}`, task)
      const index = tasks.value.findIndex((t) => t.id === id)
      if (index !== -1) {
        tasks.value[index] = response?.data.data
      }
      if (currentTask.value?.id === id) {
        currentTask.value = response?.data.data
      }
      return response.status === 200
    } catch (error) {
      console.error('Failed to update task:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  const updateTaskStatus = async (id: number, state: number) => {
    try {
      loading.value = true
      const response = await api.patch<ResponseAPI>(`/tasks/status/${id}`, { state: state })
      console.log(response)
      const index  =  tasks.value.findIndex((t) => t.id === id)
      tasks.value[index] = response?.data?.data
      return response.status === 200
    } catch (error) {
      console.error('Failed to update task status:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  const updateTaskArchived = async (id: number, state: number) => {
    try {
      loading.value = true
      const response = await api.patch<ResponseAPI>(`/tasks/archived/${id}`, { state: state })
      const index  =  tasks.value.findIndex((t) => t.id === id)
      tasks.value[index] = response?.data?.data
      return response.status === 200
    } catch (error) {
      console.error('Failed to update task status:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  const createComment = async(id: number, content: string) =>{
    try {
        loading.value = true
        const response = await api.post<ResponseAPI>(`/comments/task/${id}`, {content: content})
        comment.value.push(response?.data?.data)
      } catch (error) {
        console.error('Failed to fetch step:', error)
        throw error
      } finally {
        loading.value = false
      }
  }

  const fetchFilteredTasks = async(params: {
    name?: string
    startTime?: string
    endTime?: string
    status?: number
    isArchived?:boolean
    soft_by?: number
    page?:number
    limit?:number
    step_id ?:number
  }) =>{
    loading.value = true
    const query = new URLSearchParams()
    if (params.name) query.append('name', params.name)
    if (params.startTime) query.append('startTime', params.startTime)
    if (params.endTime) query.append('endTime', params.endTime)
    if (params.status) query.append('status', String(params.status))
    if (params.isArchived !== undefined) query.append('isArchived', String(params.isArchived))
    if (params.soft_by) query.append('softBy', String(params.soft_by))
    const res = await api.get<ResponseAPI>(`/filter/tasks/${params.step_id}?name=${query.get('name') ? query.get('name')  : ''}&start_time=${query.get('startTime') ? query.get('startTime') : ''}&end_time=${query.get('endTime') ? query.get('endTime') : ''}&is_archived=${query.get('isArchived')}&state=${query.get('status')? query.get('status') : ''}&soft_by=${query.get('softBy') ? query.get('softBy') : 0}&page=${params.page}&limit=${params.limit}`)
    tasks.value = res?.data?.data?.data
    loading.value = false
  }


  const updateComment = async (commentId: number, params:{
    content: string
  }) =>{
    try {
      loading.value = true
      const response = await api.patch<ResponseAPI>(`/comments/${commentId}`, {content: params.content})
      const index = comment.value.findIndex((c) => c.id == commentId)
      comment.value[index] = response?.data?.data
      return response.status === 200
    } catch (error) {
      console.error('Failed to fetch step:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  const deleteComment = async(commentId: number) => {
    try {
      loading.value = true
      const response = await api.delete<ResponseAPI>(`/comments/${commentId}`)
      const index = comment.value.findIndex((c) => c.id == commentId)
      if (index !== -1) {
        comment.value.splice(index, 1)
      }
      return response.status === 200
    } catch (error) {
      console.error('Failed to fetch step:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    tasks,
    currentTask,
    comment,
    loading,
    fetchTasks,
    fetchTask,
    createTask,
    updateTask,
    updateTaskStatus,
    fetchComment,
    createComment,
    fetchFilteredTasks,
    updateComment,
    deleteComment,
    updateTaskArchived,
  }
})
