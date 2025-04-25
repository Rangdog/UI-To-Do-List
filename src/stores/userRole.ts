import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/axios'

interface User {
  id: number
  User: any
  role_id: number
}

interface Role {
  id: number
  title: string
}
interface Invite {
  id: number
  Email: string
  ProjectId: any
  token: string
  Status: string
  CreatedAt: string
}
interface UserWithRBAC {
  id: number
  username: string
  name: string
  role: Number
  email: string
  token: string
  is_activate: boolean
  user_id: number
  role_id: number
  project_id: number
  step_id: number
}
export const useUserRoleStore = defineStore('userRole', () => {
  const userStepRole = ref<UserWithRBAC[]>([])
  const usersRole = ref<User[]>([])
  const usersNotRole = ref<User[]>([])
  const userInvitedPending = ref<Invite[]>([])
  const roles = ref<Role[]>([])
  const loading = ref(true)
  interface ResponseAPI {
    response_key: string
    response_message: string
    data: any
  }

  const fetchUsersNotRole = async (id: Number) => {
    loading.value = true
    try {
      const res = await api.get<ResponseAPI>(`/projects/manage/not_role/${id}`)
      usersNotRole.value = res?.data?.data
    } catch (error) {
      console.error('Failed to fetch users', error)
    } finally {
      loading.value = false
    }
  }

  const fetchUsersRole = async (id: Number) => {
    loading.value = true
    try {
      const res = await api.get<ResponseAPI>(`/projects/manage/role/${id}`)
      usersRole.value = res?.data?.data
    } catch (error) {
      console.error('Failed to fetch users', error)
    } finally {
      loading.value = false
    }
  }

  const fetchUsersRoleStep = async (stepId: Number) => {
    loading.value = true
    try {
      const res = await api.get<ResponseAPI>(`/steps_user/${stepId}`)
      userStepRole.value = res?.data?.data
    } catch (error) {
      console.error('Failed to fetch users', error)
    } finally {
      loading.value = false
    }
  }

  const fetchUsersRoleTask = async (taskId: Number) => {
    loading.value = true
    try {
      const res = await api.get<ResponseAPI>(`/tasks_user/${taskId}`)
      userStepRole.value = res?.data?.data
    } catch (error) {
      console.error('Failed to fetch users', error)
    } finally {
      loading.value = false
    }
  }

  const fetchRole = async () => {
    loading.value = true
    try {
      const res = await api.get<ResponseAPI>(`/role`)
      roles.value = res?.data?.data
    } catch (error) {
      console.error('failed to fetch role', error)
    } finally {
      loading.value = false
    }
  }

  const fetchInvite = async (projectId: number) => {
    loading.value = true
    try {
      const res = await api.get<ResponseAPI>(`/invite/${projectId}`)
      userInvitedPending.value = res?.data?.data
    } catch (error) {
      console.error('failed to fetch role', error)
    } finally {
      loading.value = false
    }
  }

  const invite = async (params: {
    username?: string
    ProjectId?: number
    RoleSlug?: string
  }) => {
    loading.value = true
    try {
      const res = await api.post<ResponseAPI>("/invite", {
        username_or_email: params.username || "",
        project_id: params.ProjectId,
        role_slug: params.RoleSlug
      })
      if (res.status === 201){
        return {status:true, msg:res?.data.response_message}
      }else{
        return {status:true, msg:res?.data.response_message}
      }
    } catch (error: any) {
      console.error('failed to fetch role', error)
      return {status:false, msg:error?.response?.data.response_message}
    } finally {
      loading.value = false
    }
  }

  const updateUserRole = async (params: {
    userId: number
    projectId?: number
    stepId?: number
    taskId?: number
    Slug: String
  }) => {
    loading.value = true
    try {
      const res = await api.patch<ResponseAPI>("/role/update", {
        user_id: params.userId,
        project_id: params.projectId,
        step_id: params.stepId,
        task_id: params.taskId,
        slug: params.Slug
      })
      if (res.status === 200){
        return {status:true, msg: res?.data?.response_message}
      }
    } catch (error:any) {
      console.error('failed to fetch role', error)
      return {status:false, msg: error?.response?.data?.response_message}
    } finally {
      loading.value = false
    }
  }

  const remove = async(email:string, taskId?:number,projectId?:number,stepId?:number) =>{
    try {
      loading.value = true
      const response = await api.delete<ResponseAPI>(`/role/remove`,{data: { email: email,task_id:taskId ||null,project_id:projectId||null, step_id: stepId ||null},})
      if (response.status === 200){
        return {status:true, msg: response?.data?.response_message}
      }
      return response.status === 200
    } catch (error:any) {
      console.error('Failed to fetch step:', error)
      return {status:false, msg: error?.response?.data?.response_message}
    } finally {
      loading.value = false
    }
  }

  return {
    usersRole,
    usersNotRole,
    roles,
    loading,
    userInvitedPending,
    userStepRole,
    fetchUsersRole,
    fetchUsersNotRole,
    fetchRole,
    invite,
    fetchInvite,
    updateUserRole,
    fetchUsersRoleStep,
    fetchUsersRoleTask,
    remove,
  }
})
