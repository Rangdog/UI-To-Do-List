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
  const createTask = async (task: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'status_id'>) => {
    try {
      loading.value = true
      const response = await api.post<ResponseAPI>('/tasks', task)
      tasks.value.push(response?.data?.data)
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
      const response = await api.patch<ResponseAPI>(`/tasks/${id}`, task)
      const index = tasks.value.findIndex((t) => t.id === id)
      if (index !== -1) {
        tasks.value[index] = response?.data.data
      }
      if (currentTask.value?.id === id) {
        currentTask.value = response?.data.data
      }
      return response?.data?.data
    } catch (error) {
      console.error('Failed to update task:', error)
      throw error
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
      return response.data.data
    } catch (error) {
      console.error('Failed to update task status:', error)
      throw error
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


//   const deleteTask = async (id: number) => {
//     try {
//       loading.value = true
//       await api.delete(`/tasks/${id}`)
//       if (currentStep.value?.tasks) {
//         currentStep.value.tasks = currentStep.value.tasks.filter((t) => t.id !== id)
//       }
//     } catch (error) {
//       console.error('Failed to delete task:', error)
//       throw error
//     } finally {
//       loading.value = false
//     }
//   }

//   // Comment methods
//   const createComment = async (comment: Omit<Comment, 'id' | 'created_at' | 'updated_at'>) => {
//     try {
//       loading.value = true
//       const response = await api.post<Comment>('/comments', comment)
//       if (comment.task_id && currentStep.value?.tasks) {
//         const task = currentStep.value.tasks.find((t) => t.id === comment.task_id)
//         if (task) {
//           if (!task.comments) {
//             task.comments = []
//           }
//           task.comments.push(response.data)
//         }
//       }
//       return response.data
//     } catch (error) {
//       console.error('Failed to create comment:', error)
//       throw error
//     } finally {
//       loading.value = false
//     }
//   }

//   const updateComment = async (id: number, content: string) => {
//     try {
//       loading.value = true
//       const response = await api.patch<Comment>(`/comments/${id}`, { content })
//       if (currentStep.value?.tasks) {
//         for (const task of currentStep.value.tasks) {
//           if (task.comments) {
//             const index = task.comments.findIndex((c) => c.id === id)
//             if (index !== -1) {
//               task.comments[index] = response.data
//               break
//             }
//           }
//         }
//       }
//       return response.data
//     } catch (error) {
//       console.error('Failed to update comment:', error)
//       throw error
//     } finally {
//       loading.value = false
//     }
//   }

//   const deleteComment = async (id: number) => {
//     try {
//       loading.value = true
//       await api.delete(`/comments/${id}`)
//       if (currentStep.value?.tasks) {
//         for (const task of currentStep.value.tasks) {
//           if (task.comments) {
//             task.comments = task.comments.filter((c) => c.id !== id)
//           }
//         }
//       }
//     } catch (error) {
//       console.error('Failed to delete comment:', error)
//       throw error
//     } finally {
//       loading.value = false
//     }
//   }

//   const setCurrentStep = (step: Step | null) => {
//     currentStep.value = step
//   }

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
  }
    // deleteTask,
    // createComment,
    // updateComment,
    // deleteComment,
    // setCurrentStep,
})
