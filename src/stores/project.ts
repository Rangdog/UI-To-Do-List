import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/axios'

export interface Project {
  id: number
  name: string
  description: string
  created_at: string
  updated_at: string
  is_archived: boolean
  user_id: number
}

interface ResponseAPI {
  response_key: string
  response_message: string
  data: any
}

export const useProjectStore = defineStore('project', () => {
  const projects = ref<Project[]>([])
  const currentProject = ref<Project | null>(null)
  const loading = ref(false)

  const fetchProjects = async () => {
    try {
      loading.value = true
      const response = await api.get<ResponseAPI>('/projects')
      projects.value = response.data.data
    } catch (error) {
      console.error('Failed to fetch projects:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const createProject = async (
    project: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'user_id'>,
  ) => {
    try {
      loading.value = true
      const response = await api.post<ResponseAPI>('/projects', project)
      projects.value.push(response?.data?.data)
      return  response?.data?.data
    } catch (error) {
      console.error('Failed to create project:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const updateProject = async (id: number, project: Partial<Project>) => {
    try {
      loading.value = true
      const response = await api.patch<ResponseAPI>(`/projects/${id}`, project)
      console.log(response)
      const index = projects.value.findIndex((p) => p.id === id)
      if (index !== -1) {
        projects.value[index] = response?.data?.data
      }
      return  response?.data?.data
    } catch (error) {
      console.error('Failed to update project:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const deleteProject = async (id: number) => {
    try {
      loading.value = true
      await api.delete(`/projects/${id}`)
      projects.value = projects.value.filter((p) => p.id !== id)
    } catch (error) {
      console.error('Failed to delete project:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchProject = async(id : number) =>{
    try{
      loading.value = true
      const res = await api.get(`/projects/${id}`)
      currentProject.value = res.data.data
    }
    catch (error) {
      console.error('Failed to delete project:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const setCurrentProject = (project: Project | null) => {
    currentProject.value = project
  }

  const fetchFilteredProjects = async(params: {
    name?: string
    startTime?: string
    endTime?: string
    isArchived?: boolean
    page?:number
    limit?:number
  }) =>{
    loading.value = true
    const query = new URLSearchParams()
    if (params.name) query.append('name', params.name)
    if (params.startTime) query.append('startTime', params.startTime)
    if (params.endTime) query.append('endTime', params.endTime)
    if (params.isArchived !== undefined) query.append('isArchived', String(params.isArchived))
    const res = await api.get<ResponseAPI>(`/filter/projects?name=${query.get('name') ? query.get('name')  : ''}&start_time=${query.get('startTime') ? query.get('startTime') : ''}&end_time=${query.get('endTime') ? query.get('endTime') : ''}&is_archived=${query.get('isArchived')}&page=${params.page}&limit=${params.limit}`)
    projects.value = res?.data?.data?.data
    loading.value = false
  }

  return {
    projects,
    currentProject,
    loading,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    fetchProject,
    setCurrentProject,
    fetchFilteredProjects,
  }
})
