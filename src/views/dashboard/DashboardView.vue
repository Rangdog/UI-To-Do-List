<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">My Projects</h1>
      <button
       @click="() => { showCreateModal = true; editingProject = null }"
        class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
      >
        Create Project
      </button>
    </div>

    <!-- Projects Grid -->
    <div
      v-if="!projectStore.loading && projectStore.projects.length > 0"
      class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      <div
        v-for="project in projectStore.projects"
        :key="project.id"
        class="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
      >
        <div class="flex justify-between items-start">
          <h2 class="text-lg font-medium text-gray-900">{{ project.name }}</h2>
          <div class="flex space-x-2">
            <button @click="editProject(project)" class="text-gray-400 hover:text-gray-500">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                />
              </svg>
            </button>
            <button
              @click="handleDeleteProject(project.id)"
              class="text-gray-400 hover:text-red-500"
            >
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
        <p class="mt-2 text-sm text-gray-500">{{ project.description }}</p>
        <div class="mt-4 flex justify-between items-center">
          <span class="text-sm text-gray-500">
            Created: {{ new Date(project.created_at).toLocaleDateString() }}
          </span>
          <router-link
            :to="`/projects/${project.id}`"
            class="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            View Details →
          </router-link>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!projectStore.loading" class="text-center py-12">
      <svg
        class="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
        />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No projects</h3>
      <p class="mt-1 text-sm text-gray-500">Get started by creating a new project.</p>
      <div class="mt-6">
        <button
          @click="showCreateModal = true"
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          New Project
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
    </div>

    <!-- Create/Edit Project Modal -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg font-medium text-gray-900">
            {{ editingProject ? 'Edit Project' : 'Create Project' }}
          </h3>
          <form @submit.prevent="handleSubmit" class="mt-4 space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">
                Project Name
              </label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label for="description" class="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                v-model="form.description"
                rows="3"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              ></textarea>
            </div>
            <div class="flex justify-end space-x-3">
              <button
                type="button"
                @click="showCreateModal = false"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                {{ editingProject ? 'Update' : 'Create' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useProjectStore } from '@/stores/project'
import type { Project } from '@/stores/project'

const projectStore = useProjectStore()

const showCreateModal = ref(false)
const editingProject = ref<Project | null>(null)

const form = ref({
  name: '',
  description: '',
  is_archived: false,
})

onMounted(async () => {
  await projectStore.fetchProjects()
})

const handleSubmit = async () => {
  try {
    if (editingProject.value) {
      await projectStore.updateProject(editingProject.value.id, form.value)
    } else {
      await projectStore.createProject(form.value)
    }
    showCreateModal.value = false
    form.value = { name: '', description: '', is_archived: false }
    editingProject.value = null
  } catch (error) {
    console.error('Failed to save project:', error)
  }
}

const editProject = (project: Project) => {
  editingProject.value = project
  form.value = {
    name: project.name,
    description: project.description,
    is_archived: project.is_archived,
  }
  showCreateModal.value = true
}

const handleDeleteProject = async (id: number) => {
  if (confirm('Are you sure you want to delete this project?')) {
    try {
      await projectStore.deleteProject(id)
    } catch (error) {
      console.error('Failed to delete project:', error)
    }
  }
}
</script>
