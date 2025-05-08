<template>
  <!-- Filters Section -->
  <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
    <h2 class="text-lg font-semibold text-gray-900 mb-4">Filter Projects</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Name Filter -->
      <div>
        <label for="filter-name" class="block text-sm font-medium text-gray-700">Project Name</label>
        <input
          id="filter-name"
          v-model="filters.name"
          type="text"
          placeholder="Search by name..."
          class="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
        />
      </div>

      <!-- Date Range -->
      <div>
        <label for="start-date" class="block text-sm font-medium text-gray-700">Start Date</label>
        <input
          id="start-date"
          v-model="filters.startTime"
          type="date"
          class="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
        />
      </div>

      <div>
        <label for="end-date" class="block text-sm font-medium text-gray-700">End Date</label>
        <input
          id="end-date"
          v-model="filters.endTime"
          type="date"
          class="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
        />
      </div>

      <!-- Sort By Filter -->
      <div>
        <label for="softBy" class="block text-sm font-medium text-gray-700">Sort By</label>
        <select
          id="softBy"
          v-model="filters.softBy"
          class="mt-1 block w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2.5 transition-all duration-200"
        >
          <option value="0">None</option>
          <option value="1">Name (A-Z)</option>
          <option value="2">Name (Z-A)</option>
          <option value="3">Created (Oldest)</option>
          <option value="4">Created (Newest)</option>
          <option value="5">Updated (Oldest)</option>
          <option value="6">Updated (Newest)</option>
        </select>
      </div>

      <!-- Archived Checkbox -->
      <div class="flex items-center sm:col-span-2 lg:col-span-1">
        <input
          id="archived"
          type="checkbox"
          v-model="filters.isArchived"
          class="h-4 w-4 text-indigo-600 border-gray-200 rounded focus:ring-indigo-500"
        />
        <label for="archived" class="ml-2 text-sm text-gray-700">Show Archived</label>
      </div>

      <!-- Filter Actions -->
      <div class="flex space-x-3 sm:col-span-2 lg:col-span-1">
        <button
          @click="clearFilters"
          class="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
        >
          Clear
        </button>
        <button
          @click="applyFilters"
          class="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
        >
          Apply Filters
        </button>
      </div>
    </div>
  </div>

  <!-- Projects Header -->
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-2xl font-bold text-gray-900">My Projects</h1>
    <button
      @click="() => { showCreateModal = true; editingProject = null }"
      class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
    >
      <svg class="-ml-1 mr-2 h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
      Create Project
    </button>
  </div>

  <!-- Projects Grid -->
  <div v-if="!projectStore.loading && projectStore.projects.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <div
      v-for="project in projectStore.projects"
      :key="project.id"
      class="bg-white rounded-lg shadow-sm p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
    >
      <div class="flex justify-between items-start">
        <h2 class="text-lg font-semibold text-gray-900 truncate">{{ project.name }}</h2>
        <div class="flex space-x-2">
          <button
            @click="editProject(project)"
            class="text-gray-400 hover:text-indigo-600 transition-colors duration-200"
            aria-label="Edit project"
          >
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
              />
            </svg>
          </button>
          <button
            @click="handleArchivedProject(project.id)"
            class="text-gray-400 hover:text-red-500 transition-colors duration-200"
            aria-label="Archive project"
          >
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M4 3a1 1 0 000 2h12a1 1 0 100-2H4zm1 4a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2V9a2 2 0 00-2-2H5zm5 2a1 1 0 011 1v1h2a1 1 0 110 2H7a1 1 0 110-2h2v-1a1 1 0 011-1z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
      <p class="mt-2 text-sm text-gray-600 line-clamp-2">{{ project.description }}</p>
      <div class="mt-4 flex justify-between items-center">
        <span class="text-sm text-gray-500">
          Created: {{ new Date(project.created_at).toLocaleDateString() }}
        </span>
        <router-link
          :to="`/projects/${project.id}`"
          class="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
        >
          View Details →
        </router-link>
      </div>
    </div>
  </div>

  <!-- Empty State -->
  <div v-else-if="!projectStore.loading" class="text-center py-16 bg-gray-50 rounded-lg">
    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
      />
    </svg>
    <h3 class="mt-2 text-lg font-semibold text-gray-900">No Projects Found</h3>
    <p class="mt-1 text-sm text-gray-500">Get started by creating a new project or adjusting your filters.</p>
    <button
      @click="showCreateModal = true"
      class="mt-6 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
    >
      <svg class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
      New Project
    </button>
  </div>

  <!-- Loading State -->
  <div v-else class="text-center py-16">
    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-600 mx-auto"></div>
    <p class="mt-4 text-sm text-gray-600">Loading projects...</p>
  </div>

  <!-- Pagination -->
  <div v-if="projectStore.projects.length > 0" class="mt-6 flex justify-center space-x-3">
    <button
      @click="prevPage"
      :disabled="currentPage === 1"
      class="px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
    >
      Previous
    </button>
    <span class="flex items-center text-sm text-gray-700">Page {{ currentPage }}</span>
    <button
      @click="nextPage"
      class="px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
    >
      Next
    </button>
  </div>

  <!-- Create/Edit Project Modal -->
  <transition name="modal">
    <div v-if="showCreateModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full transform transition-all duration-300 scale-100">
        <div class="px-6 py-5">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ editingProject ? 'Edit Project' : 'Create Project' }}
          </h3>
          <form @submit.prevent="handleSubmit" class="mt-4 space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">Project Name</label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                class="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
              />
            </div>
            <div>
              <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                v-model="form.description"
                rows="4"
                class="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
              ></textarea>
            </div>
            <div class="flex justify-end space-x-3">
              <button
                type="button"
                @click="showCreateModal = false"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                {{ editingProject ? 'Update' : 'Create' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useProjectStore } from '@/stores/project'
import type { Project } from '@/stores/project'
import { useToast } from 'vue-toastification'

const toast = useToast()
const projectStore = useProjectStore()

const showCreateModal = ref(false)
const editingProject = ref<Project | null>(null)

const form = ref({
  name: '',
  description: '',
  is_archived: false,
})
const currentPage = ref(1)
const limit = ref(12)
const filters = ref({
  name: '',
  startTime: '',
  endTime: '',
  isArchived: false,
  softBy: 0,
})

onMounted(async () => {
  await projectStore.fetchFilteredProjects({
    name: filters.value.name,
    startTime: filters.value.startTime || undefined,
    endTime: filters.value.endTime || undefined,
    isArchived: filters.value.isArchived,
    softBy: filters.value.softBy,
    page: currentPage.value,
    limit: limit.value,
  })
})

const applyFilters = async () => {
  try {
    await projectStore.fetchFilteredProjects({
      name: filters.value.name,
      startTime: filters.value.startTime || undefined,
      endTime: filters.value.endTime || undefined,
      isArchived: filters.value.isArchived,
      softBy: filters.value.softBy,
      page: currentPage.value,
      limit: limit.value,
    })
  } catch (error) {
    console.error('Error while applying filters:', error)
    toast.error('Failed to apply filters')
  }
}

const clearFilters = () => {
  filters.value = {
    name: '',
    startTime: '',
    endTime: '',
    isArchived: false,
    softBy: 0,
  }
  currentPage.value = 1
  applyFilters()
}

const handleSubmit = async () => {
  try {
    if (editingProject.value) {
      const res = await projectStore.updateProject(editingProject.value.id, form.value)
      if (res?.status) {
        toast.success('Project updated successfully!')
      } else {
        toast.error(res?.msg || 'Failed to update project')
      }
    } else {
      const res = await projectStore.createProject(form.value)
      if (res?.status) {
        toast.success('Project created successfully!')
      } else {
        toast.error(res?.msg || 'Failed to create project')
      }
    }
    showCreateModal.value = false
    form.value = { name: '', description: '', is_archived: false }
    editingProject.value = null
  } catch (error) {
    console.error('Failed to save project:', error)
    toast.error('An error occurred while saving the project')
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

const handleArchivedProject = async (id: number) => {
  if (confirm('Are you sure you want to archive this project?')) {
    try {
      const res = await projectStore.updateStepArchived(id)
      if (res?.status) {
        toast.success('Project archived successfully!')
        await projectStore.fetchFilteredProjects({
          name: filters.value.name,
          startTime: filters.value.startTime || undefined,
          endTime: filters.value.endTime || undefined,
          isArchived: filters.value.isArchived,
          softBy: filters.value.softBy,
          page: currentPage.value,
          limit: limit.value,
        })
      } else {
        toast.error(res?.msg || 'Failed to archive project')
      }
    } catch (error) {
      console.error('Failed to archive project:', error)
      toast.error('An error occurred while archiving the project')
    }
  }
}

watch(
  filters,
  () => {
    currentPage.value = 1
    projectStore.fetchFilteredProjects({
      name: filters.value.name,
      startTime: filters.value.startTime || undefined,
      endTime: filters.value.endTime || undefined,
      isArchived: filters.value.isArchived,
      softBy: filters.value.softBy,
      page: currentPage.value,
      limit: limit.value,
    })
  },
  { deep: true }
)

const nextPage = () => {
  currentPage.value++
  projectStore.fetchFilteredProjects({
    name: filters.value.name,
    startTime: filters.value.startTime || undefined,
    endTime: filters.value.endTime || undefined,
    isArchived: filters.value.isArchived,
    softBy: filters.value.softBy,
    page: currentPage.value,
    limit: limit.value,
  })
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    projectStore.fetchFilteredProjects({
      name: filters.value.name,
      startTime: filters.value.startTime || undefined,
      endTime: filters.value.endTime || undefined,
      isArchived: filters.value.isArchived,
      softBy: filters.value.softBy,
      page: currentPage.value,
      limit: limit.value,
    })
  }
}
</script>

<style scoped>
/* Modal transition animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>