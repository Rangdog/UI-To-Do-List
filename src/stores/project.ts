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

export class ProjectAgile {
  id: string
  title: string
  items: any[] = []

  constructor() {
    this.id = "";
    this.title = "";
  }
}

export const useProjectStore = defineStore('project', () => {
  const projects = ref<Project[]>([])
  const projectsAgile = ref<ProjectAgile[]>([])
  const currentProject = ref<Project | null>(null)
  const notification = ref(false)
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
      return response.status === 201
    } catch (error) {
      console.error('Failed to create project:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  const updateProject = async (id: number, project: Partial<Project>) => {
    try {
      loading.value = true
      const response = await api.patch<ResponseAPI>(`/projects/${id}`, project)
      const index = projects.value.findIndex((p) => p.id === id)
      if (index !== -1) {
        projects.value[index] = response?.data?.data
      }
      return response.status === 200
    } catch (error) {
      console.error('Failed to update project:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  const updateStepArchived = async (id: number) => {
    try {
      loading.value = true
      const response = await api.patch<ResponseAPI>(`/projects/archived/${id}`)
      const index = projects.value.findIndex((p) => p.id === id)
      if (index !== -1) {
        projects.value[index] = response?.data?.data
      }
      return response.status === 200
    } catch (error) {
      console.error('Failed to update step status:', error)
      return false
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
      return false
    } finally {
      loading.value = false
    }
  }


  const fetchProject = async (id: number) => {
    try {
      loading.value = true
      const res = await api.get(`/projects/${id}`)
      console.log(res)
      currentProject.value = res.data.data.project
      notification.value = res.data.data.notification
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

  const fetchFilteredProjects = async (params: {
    name?: string
    startTime?: string
    endTime?: string
    isArchived?: boolean
    softBy?: number
    page?: number
    limit?: number
  }) => {
    loading.value = true
    const query = new URLSearchParams()
    if (params.name) query.append('name', params.name)
    if (params.startTime) query.append('startTime', params.startTime)
    if (params.endTime) query.append('endTime', params.endTime)
    if (params.isArchived !== undefined) query.append('isArchived', String(params.isArchived))
    if (params.softBy) query.append('softBy', String(params.softBy))
    const res = await api.get<ResponseAPI>(`/filter/projects?name=${query.get('name') ? query.get('name') : ''}&start_time=${query.get('startTime') ? query.get('startTime') : ''}&end_time=${query.get('endTime') ? query.get('endTime') : ''}&is_archived=${query.get('isArchived')}&soft_by=${query.get('softBy') ? query.get('softBy') : 0}&page=${params.page}&limit=${params.limit}`)
    projects.value = res?.data?.data?.data
    loading.value = false
  }

  const fetchFilteredProjectsForAgile = async () => {
    loading.value = true
    const res = await api.get(`/projects/agile`)
    let projects: ProjectAgile[] = []
    const keySet = new Set(projects.map(project => project.id));
    const missingProjects = ["project", "archive"]
      .filter(id => !keySet.has(id))
      .map(id => {
        const project = new ProjectAgile();
        project.id = id;
        project.title = id.toUpperCase();
        return project;
      });
    projects.push(...missingProjects)
    for (let i = 0; i < res?.data?.data?.length; i++) {
      let project: ProjectAgile = new ProjectAgile()
      if (res?.data?.data[i].project.is_archived) {
        const key = projects.find(p => p.id === "archive")
        let item: any = {
          id: res?.data?.data[i].project.id,
          name: res?.data?.data[i].project.name,
          description: res?.data?.data[i].project.description,
          user: {
            name: res?.data?.data[i].user.username
          }
        }
        if (key) key.items.push(item)
      } else {
        const key = projects.find(p => p.id === "project")
        let item: any = {
          id: res?.data?.data[i].project.id,
          name: res?.data?.data[i].project.name,
          description: res?.data?.data[i].project.description,
          user: {
            name: res?.data?.data[i].user.username
          }
        }
        if (key) key.items.push(item)
      }
    }
    projectsAgile.value = projects
  }

  const ToggleNotification = async (projectId: number, notificationUpdate :boolean) => {
    try {
      loading.value = true
      const res = await api.patch(`/notification`, {
        project_id: projectId,
        notifications_enabled:notificationUpdate
      })
      return res.status === 200
    }
    catch (error) {
      console.error('Failed to delete project:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    projects,
    currentProject,
    loading,
    projectsAgile,
    notification,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    fetchProject,
    setCurrentProject,
    fetchFilteredProjects,
    updateStepArchived,
    fetchFilteredProjectsForAgile,
    ToggleNotification,
  }
})
