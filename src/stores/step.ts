import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/axios'

export interface Step {
  id: number
  name: string
  description: string
  created_at: string
  updated_at: string
  is_archived: boolean
  status_id: number
  project_id: number
  tasks?: Task[]
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
}

export const useStepStore = defineStore('step', () => {
  const steps = ref<Step[]>([])
  const currentStep = ref<Step | null>(null)
  const loading = ref(false)

  // Step methods
  const fetchSteps = async (projectId: number) => {
    try {
      loading.value = true
      const response = await api.get<Step[]>(`/steps?project_id=${projectId}`)
      steps.value = response.data
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
      const response = await api.get<Step>(`/steps/${id}`)
      currentStep.value = response.data
    } catch (error) {
      console.error('Failed to fetch step:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const createStep = async (step: Omit<Step, 'id' | 'created_at' | 'updated_at' | 'status_id'>) => {
    try {
      loading.value = true
      const response = await api.post<Step>('/steps', step)
      steps.value.push(response.data)
      return response.data
    } catch (error) {
      console.error('Failed to create step:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const updateStep = async (id: number, step: Partial<Step>) => {
    try {
      loading.value = true
      const response = await api.patch<Step>(`/steps/${id}`, step)
      const index = steps.value.findIndex((s) => s.id === id)
      if (index !== -1) {
        steps.value[index] = response.data
      }
      if (currentStep.value?.id === id) {
        currentStep.value = response.data
      }
      return response.data
    } catch (error) {
      console.error('Failed to update step:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const deleteStep = async (id: number) => {
    try {
      loading.value = true
      await api.delete(`/steps/${id}`)
      steps.value = steps.value.filter((s) => s.id !== id)
      if (currentStep.value?.id === id) {
        currentStep.value = null
      }
    } catch (error) {
      console.error('Failed to delete step:', error)
      throw error
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

  const updateTaskStatus = async (id: number, statusId: number) => {
    try {
      loading.value = true
      const response = await api.patch<Task>(`/tasks/${id}`, { status_id: statusId })
      if (currentStep.value?.tasks) {
        const index = currentStep.value.tasks.findIndex((t) => t.id === id)
        if (index !== -1) {
          currentStep.value.tasks[index] = response.data
        }
      }
      return response.data
    } catch (error) {
      console.error('Failed to update task status:', error)
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

  // Comment methods
  const createComment = async (comment: Omit<Comment, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      loading.value = true
      const response = await api.post<Comment>('/comments', comment)
      if (comment.task_id && currentStep.value?.tasks) {
        const task = currentStep.value.tasks.find((t) => t.id === comment.task_id)
        if (task) {
          if (!task.comments) {
            task.comments = []
          }
          task.comments.push(response.data)
        }
      }
      return response.data
    } catch (error) {
      console.error('Failed to create comment:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const updateComment = async (id: number, content: string) => {
    try {
      loading.value = true
      const response = await api.patch<Comment>(`/comments/${id}`, { content })
      if (currentStep.value?.tasks) {
        for (const task of currentStep.value.tasks) {
          if (task.comments) {
            const index = task.comments.findIndex((c) => c.id === id)
            if (index !== -1) {
              task.comments[index] = response.data
              break
            }
          }
        }
      }
      return response.data
    } catch (error) {
      console.error('Failed to update comment:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const deleteComment = async (id: number) => {
    try {
      loading.value = true
      await api.delete(`/comments/${id}`)
      if (currentStep.value?.tasks) {
        for (const task of currentStep.value.tasks) {
          if (task.comments) {
            task.comments = task.comments.filter((c) => c.id !== id)
          }
        }
      }
    } catch (error) {
      console.error('Failed to delete comment:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const setCurrentStep = (step: Step | null) => {
    currentStep.value = step
  }

  return {
    steps,
    currentStep,
    loading,
    fetchSteps,
    fetchStep,
    createStep,
    updateStep,
    deleteStep,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    createComment,
    updateComment,
    deleteComment,
    setCurrentStep,
  }
})
