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
  priority: number
  assigner: any
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
  User?: any
}


interface ResponseAPI {
  response_key: string
  response_message: string
  data: any
}

export const useTaskStore = defineStore('task', () => {
  const tasks = ref<Task[]>([])
  const tasksAgile = ref<any[]>([])
  const currentTask = ref<Task | null>(null)
  const comment = ref<Comment[]>([])
  const loading = ref(false)
  const notification = ref(false)

  // Step methods
  const fetchTasks = async (step_id: number) => {
    try {
      loading.value = true
      const response = await api.get<ResponseAPI>(`/tasks/step/${step_id}`)
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
      currentTask.value = response?.data?.data?.task
      notification.value = response?.data?.data?.notification
    } catch (error) {
      console.error('Failed to fetch step:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchComment = async (id: number) => {
    try {
      loading.value = true
      const response = await api.get<ResponseAPI>(`/comments/task/${id}`)
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
      if (response.status === 201){
        return {status:true, msg:response?.data.response_message}
      }else{
        return {status:true, msg:response?.data.response_message}
      }
    } catch (error:any) {
      console.error('Failed to create task:', error)
      return {status:false, msg:error?.response?.data.response_message}
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
      if (response.status === 200){
        return {status:true, msg:response?.data.response_message}
      }else{
        return {status:true, msg:response?.data.response_message}
      }
    } catch (error:any) {
      console.error('Failed to update task:', error)
      return {status:false, msg:error?.response?.data.response_message}
    } finally {
      loading.value = false
    }
  }

  const updateTaskStatus = async (id: number, state: number) => {
    try {
      loading.value = true
      const response = await api.patch<ResponseAPI>(`/tasks/status/${id}`, { state: state })
      const index = tasks.value.findIndex((t) => t.id === id)
      tasks.value[index] = response?.data?.data
      if (response.status === 200){
        return {status:true, msg:response?.data.response_message}
      }else{
        return {status:true, msg:response?.data.response_message}
      }
    } catch (error:any) {
      console.error('Failed to update task status:', error)
      return {status:false, msg:error?.response?.data.response_message}
    } finally {
      loading.value = false
    }
  }

  const updateTaskArchived = async (id: number) => {
    try {
      loading.value = true
      const response = await api.patch<ResponseAPI>(`/tasks/archived/${id}`)
      const index = tasks.value.findIndex((t) => t.id === id)
      tasks.value[index] = response?.data?.data
      if (response.status === 200){
        return {status:true, msg:response?.data.response_message}
      }else{
        return {status:true, msg:response?.data.response_message}
      }
    } catch (error:any) {
      console.error('Failed to update task status:', error)
      return {status:false, msg:error?.response?.data.response_message}
    } finally {
      loading.value = false
    }
  }

  const createComment = async (id: number, content: string) => {
    try {
      loading.value = true
      const response = await api.post<ResponseAPI>(`/comments/task/${id}`, { content: content })
      comment.value.push(response?.data?.data)
      if (response.status === 201){
        return {status:true, msg:response?.data.response_message}
      }else{
        return {status:true, msg:response?.data.response_message}
      }
    } catch (error:any) {
      console.error('Failed to fetch step:', error)
      return {status:false, msg:error?.response?.data.response_message}
    } finally {
      loading.value = false
    }
  }

  const fetchFilteredTasks = async (params: {
    name?: string
    startTime?: string
    endTime?: string
    status?: number
    isArchived?: boolean
    soft_by?: number
    page?: number
    limit?: number
    step_id?: number
  }) => {
    loading.value = true
    const query = new URLSearchParams()
    if (params.name) query.append('name', params.name)
    if (params.startTime) query.append('startTime', params.startTime)
    if (params.endTime) query.append('endTime', params.endTime)
    if (params.status) query.append('status', String(params.status))
    if (params.isArchived !== undefined) query.append('isArchived', String(params.isArchived))
    if (params.soft_by) query.append('softBy', String(params.soft_by))
    const res = await api.get<ResponseAPI>(`/filter/tasks/${params.step_id}?name=${query.get('name') ? query.get('name') : ''}&start_time=${query.get('startTime') ? query.get('startTime') : ''}&end_time=${query.get('endTime') ? query.get('endTime') : ''}&is_archived=${query.get('isArchived')}&state=${query.get('status') ? query.get('status') : ''}&soft_by=${query.get('softBy') ? query.get('softBy') : 0}&page=${params.page}&limit=${params.limit}`)
    tasks.value = res?.data?.data?.data
    loading.value = false
  }


  const updateComment = async (commentId: number, params: {
    content: string
  }) => {
    try {
      loading.value = true
      const response = await api.patch<ResponseAPI>(`/comments/${commentId}`, { content: params.content })
      const index = comment.value.findIndex((c) => c.id == commentId)
      comment.value[index] = response?.data?.data
      if (response.status === 200){
        return {status:true, msg:response?.data.response_message}
      }else{
        return {status:true, msg:response?.data.response_message}
      }
    } catch (error:any) {
      console.error('Failed to fetch step:', error)
      return {status:false, msg:error?.response?.data.response_message}
    } finally {
      loading.value = false
    }
  }

  const deleteComment = async (commentId: number) => {
    try {
      loading.value = true
      const response = await api.delete<ResponseAPI>(`/comments/${commentId}`)
      const index = comment.value.findIndex((c) => c.id == commentId)
      if (index !== -1) {
        comment.value.splice(index, 1)
      }
      if (response.status === 200){
        return {status:true, msg:response?.data.response_message}
      }else{
        return {status:true, msg:response?.data.response_message}
      }
    } catch (error:any) {
      return {status:false, msg:error?.response?.data.response_message}
    } finally {
      loading.value = false
    }
  }

  const fetchFilteredTasksForAgile = async (projectId: number) => {
    loading.value = true
    const res = await api.get(`/tasks/agile/${projectId}`)
    tasksAgile.value = res.data.data
  }

  const setAssigner = async (userId: number, taskId: number) => {
    try {
      loading.value = true
      const response = await api.patch<ResponseAPI>(`/tasks/assigner/${taskId}`, { user_id: userId })
      if (response.status === 200){
        return {status:true, msg:response?.data.response_message}
      }else{
        return {status:true, msg:response?.data.response_message}
      }
    } catch (error:any) {
      console.error('Failed to fetch step:', error)
      return {status:false, msg:error?.response?.data.response_message}
    } finally {
      loading.value = false
    }
  }

  const setPriority = async (priority: number, taskId: number) => {
    try {
      loading.value = true
      const response = await api.patch<ResponseAPI>(`/tasks/priority/${taskId}`, { priority: priority })
      if (response.status === 200){
        return {status:true, msg:response?.data.response_message}
      }else{
        return {status:true, msg:response?.data.response_message}
      }
    } catch (error:any) {
      console.error('Failed to fetch step:', error)
      return {status:false, msg:error?.response?.data.response_message}
    } finally {
      loading.value = false
    }
  }

      const ToggleNotification = async (taskId: number, notificationUpdate :boolean) => {
        try {
          loading.value = true
          const res = await api.patch(`/notification`, {
            task_id: taskId,
            notifications_enabled:notificationUpdate
          })
          if (res.status === 200){
            return {status:true, msg:res?.data.response_message}
          }else{
            return {status:true, msg:res?.data.response_message}
          }
        }
        catch (error:any) {
          console.error('Failed to delete project:', error)
          return {status:false, msg:error?.response?.data.response_message}
        } finally {
          loading.value = false
        }
      }

  return {
    tasks,
    currentTask,
    comment,
    loading,
    tasksAgile,
    notification,
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
    fetchFilteredTasksForAgile,
    setAssigner,
    setPriority,
    ToggleNotification,
  }
})
