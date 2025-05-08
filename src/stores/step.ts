import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/axios'
import Step from '@/views/manage/step.vue'

export interface Step {
  id: number
  name: string
  description: string
  created_at: string
  updated_at: string
  is_archived: boolean
  status_id: number
  project_id: number
  Amount: number
  tasks?: Task[]
  comments?: Comment[]
}

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
  User?: any
}

interface ResponseAPI {
  response_key: string
  response_message: string
  data: any
}

export class Agile {
  id: string
  title: string
  items: any[] = []

  constructor() {
    this.id = "";
    this.title = "";
  }
}

export const useStepStore = defineStore('step', () => {
  const steps = ref<Step[]>([])
  const comments =ref<Comment[]>([])
  const stepsAgile = ref<any[]>([])
  const currentStep = ref<Step | null>(null)
  const loading = ref(false)
  const notification = ref(false)

  // Step methods
  const fetchSteps = async (projectId: number) => {
    try {
      loading.value = true
      const response = await api.get<ResponseAPI>(`/steps?project_id=${projectId}`)
      steps.value = response?.data?.data
    } catch (error) {
      console.error('Failed to fetch steps:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchStep = async (id: number) => {
    try {
      loading.value = true
      const response = await api.get<ResponseAPI>(`/steps/${id}`)
      currentStep.value = response?.data?.data?.step
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
      const response = await api.get<ResponseAPI>(`/comments/step/${id}`)
      const index = steps.value.findIndex((s) => s.id === id)
      if (index !== -1) {
        steps.value[index].comments = response?.data?.data ?? []
      }
    } catch (error) {
      console.error('Failed to fetch step:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchCommentForStep = async (id: number) => {
    try {
      loading.value = true
      const response = await api.get<ResponseAPI>(`/comments/step/${id}`)
      comments.value = response?.data?.data ?? []
    } catch (error) {
      console.error('Failed to fetch step:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const createComment = async (id: number, content: string) => {
    try {
      loading.value = true
      const res = await api.post<ResponseAPI>(`/comments/step/${id}`, { content: content })
      const index = steps.value.findIndex((s) => s.id === id)
      if (index !== -1) {
        steps.value[index].comments?.push(res?.data?.data)
      }
      if (res.status === 201){
        return {status:true, msg:res?.data.response_message}
      }else{
        return {status:true, msg:res?.data.response_message}
      }
    } catch (error:any) {
      console.error('Failed to fetch step:', error)
      return {status:false, msg:error?.response?.data.response_message}
    } finally {
      loading.value = false
    }
  }

  const createStep = async (step: Omit<Step, 'id' | 'created_at' | 'updated_at' | 'status_id' | 'is_archived' | 'Amount'>) => {
    try {
      loading.value = true
      const response = await api.post<ResponseAPI>('/steps', step)
      steps.value.push(response?.data?.data)
      if (response.status === 201){
        return {status:true, msg:response?.data.response_message}
      }else{
        return {status:true, msg:response?.data.response_message}
      }
    } catch (error:any) {
      console.error('Failed to create step:', error)
      return {status:false, msg:error?.response?.data.response_message}
    } finally {
      loading.value = false
    }
  }

  const updateStep = async (id: number, step: Partial<Step>) => {
    try {
      loading.value = true
      const response = await api.patch<ResponseAPI>(`/steps/${id}`, step)
      const index = steps.value.findIndex((s) => s.id === id)
      if (index !== -1) {
        steps.value[index] = response?.data.data
      }
      if (currentStep.value?.id === id) {
        currentStep.value = response?.data.data
      }
      if (response.status === 200){
        return {status:true, msg:response?.data.response_message}
      }else{
        return {status:true, msg:response?.data.response_message}
      }
    } catch (error:any) {
      console.error('Failed to update step:', error)
      return {status:false, msg:error?.response?.data.response_message}
    } finally {
      loading.value = false
    }
  }

  const updateStepStatus = async (id: number, state: number) => {
    try {
      loading.value = true
      const response = await api.patch<ResponseAPI>(`/steps/status/${id}`, { state: state })
      const index = steps.value.findIndex((t) => t.id === id)
      steps.value[index] = response?.data?.data
      if (response.status === 200){
        return {status:true, msg:response?.data.response_message}
      }else{
        return {status:true, msg:response?.data.response_message}
      }
    } catch (error:any) {
      console.error('Failed to update step status:', error)
      return {status:false, msg:error?.response?.data.response_message}
    } finally {
      loading.value = false
    }
  }

  const updateStepArchived = async (id: number) => {
    try {
      loading.value = true
      const response = await api.patch<ResponseAPI>(`/steps/archived/${id}`)
      const index = steps.value.findIndex((t) => t.id === id)
      steps.value[index] = response?.data?.data
      if (response.status === 200){
        return {status:true, msg:response?.data.response_message}
      }else{
        return {status:true, msg:response?.data.response_message}
      }
    } catch (error:any) {
      console.error('Failed to update step status:', error)
      return {status:false, msg:error?.response?.data.response_message}
    } finally {
      loading.value = false
    }
  }


  // Task methods
  const createTask = async (task: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'status_id'>) => {
    try {
      loading.value = true
      const response = await api.post<Task>('/tasks', task)
      if (currentStep.value) {
        if (!currentStep.value.tasks) {
          currentStep.value.tasks = []
        }
        currentStep.value.tasks.push(response.data)
      }
      return response.data
    } catch (error) {
      console.error('Failed to create task:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const updateTask = async (id: number, task: Partial<Task>) => {
    try {
      loading.value = true
      const response = await api.patch<Task>(`/tasks/${id}`, task)
      if (currentStep.value?.tasks) {
        const index = currentStep.value.tasks.findIndex((t) => t.id === id)
        if (index !== -1) {
          currentStep.value.tasks[index] = response.data
        }
      }
      return response.data
    } catch (error) {
      console.error('Failed to update task:', error)
      throw error
    } finally {
      loading.value = false
    }
  }



  const deleteTask = async (id: number) => {
    try {
      loading.value = true
      await api.delete(`/tasks/${id}`)
      if (currentStep.value?.tasks) {
        currentStep.value.tasks = currentStep.value.tasks.filter((t) => t.id !== id)
      }
    } catch (error) {
      console.error('Failed to delete task:', error)
      throw error
    } finally {
      loading.value = false
    }
  }


  const updateComment = async (id: number, content: string) => {
    try {
      loading.value = true
      const response = await api.patch<ResponseAPI>(`/comments/${id}`, { content: content })
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

  const deleteComment = async (id: number) => {
    try {
      loading.value = true
      const response = await api.delete<ResponseAPI>(`/comments/${id}`)
      if (response.status === 200){
        return {status:true, msg:response?.data.response_message}
      }else{
        return {status:true, msg:response?.data.response_message}
      }
    } catch (error : any) {
      console.error('Failed to fetch step:', error)
      return {status:false, msg:error?.response?.data.response_message}
    } finally {
      loading.value = false
    }
  }

  const setCurrentStep = (step: Step | null) => {
    currentStep.value = step
  }


  const fetchFilteredSteps = async (params: {
    name?: string
    startTime?: string
    endTime?: string
    status?: number
    isArchived?: boolean
    softBy?: number
    page?: number
    limit?: number
    project_id?: number
  }) => {
    loading.value = true
    const query = new URLSearchParams()
    if (params.name) query.append('name', params.name)
    if (params.startTime) query.append('startTime', params.startTime)
    if (params.endTime) query.append('endTime', params.endTime)
    if (params.status) query.append('status', String(params.status))
    if (params.isArchived !== undefined) query.append('isArchived', String(params.isArchived))
    if (params.softBy) query.append('softBy', String(params.softBy))
    const res = await api.get<ResponseAPI>(`/filter/steps/${params.project_id}?name=${query.get('name') ? query.get('name') : ''}&start_time=${query.get('startTime') ? query.get('startTime') : ''}&end_time=${query.get('endTime') ? query.get('endTime') : ''}&is_archived=${query.get('isArchived')}&state=${query.get('status') ? query.get('status') : ''}&soft_by=${query.get('softBy') ? query.get('softBy') : 0}&page=${params.page}&limit=${params.limit}`)
    steps.value = res?.data?.data?.data
    loading.value = false
  }


  const fetchFilteredStepsForAgile = async (projectId : number) => {
    loading.value = true
    const res = await api.get(`/steps/agile/${projectId}`)
    console.log(res)
    stepsAgile.value = res.data.data
  }


    const ToggleNotification = async (stepId: number, notificationUpdate :boolean) => {
      try {
        loading.value = true
        const res = await api.patch(`/notification`, {
          step_id: stepId,
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
    steps,
    currentStep,
    loading,
    stepsAgile,
    comments,
    notification,
    fetchSteps,
    fetchStep,
    createStep,
    updateStep,
    createTask,
    updateTask,
    updateStepStatus,
    deleteTask,
    createComment,
    updateComment,
    deleteComment,
    setCurrentStep,
    fetchComment,
    fetchFilteredSteps,
    updateStepArchived,
    fetchFilteredStepsForAgile,
    fetchCommentForStep,
    ToggleNotification
  }
})
