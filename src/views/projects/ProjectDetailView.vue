<template>
  <div class="space-y-6">
    <!-- Project Header -->
    <div class="bg-white shadow rounded-lg p-6">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ project?.name }}</h1>
          <p class="mt-2 text-gray-500">{{ project?.description }}</p>
        </div>
        <div class="flex space-x-4">
          <button
            @click="showCreateStepModal = true"
            class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Add Step
          </button>
          <button
            @click="editProject"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Edit Project
          </button>
        </div>
      </div>
    </div>

    <!-- Steps List -->
    <div class="space-y-4">
      <div
        v-for="step in steps"
        :key="step.id"
        class="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow"
      >
        <div class="flex justify-between items-start">
          <div>
            <h2 class="text-lg font-medium text-gray-900">{{ step.name }}</h2>
            <p class="mt-2 text-sm text-gray-500">{{ step.description }}</p>
          </div>
          <div class="flex space-x-2">
            <button @click="editStep(step)" class="text-gray-400 hover:text-gray-500">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                />
              </svg>
            </button>
            <button @click="deleteStep(step.id)" class="text-gray-400 hover:text-red-500">
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
        <div class="mt-4 flex justify-between items-center">
          <div class="flex items-center space-x-2">
            <span
              :class="{
                'bg-green-100 text-green-800': step.status_id === 0,
                'bg-yellow-100 text-yellow-800': step.status_id === 1,
                'bg-blue-100 text-blue-800': step.status_id === 2,
              }"
              class="px-2 py-1 text-xs font-medium rounded-full"
            >
              {{ getStatusText(step.status_id) }}
            </span>
            <span class="text-sm text-gray-500"> {{ step.tasks?.length || 0 }} tasks </span>
          </div>
          <router-link
            :to="`/steps/${step.id}`"
            class="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            View Details →
          </router-link>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && steps.length === 0" class="text-center py-12">
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
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No steps</h3>
      <p class="mt-1 text-sm text-gray-500">Get started by creating a new step.</p>
      <div class="mt-6">
        <button
          @click="showCreateStepModal = true"
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
          New Step
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
    </div>

    <!-- Create/Edit Step Modal -->
    <div
      v-if="showCreateStepModal"
      class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg font-medium text-gray-900">
            {{ editingStep ? 'Edit Step' : 'Create Step' }}
          </h3>
          <form @submit.prevent="handleSubmit" class="mt-4 space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700"> Step Name </label>
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
                @click="showCreateStepModal = false"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                {{ editingStep ? 'Update' : 'Create' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useProjectStore } from '@/stores/project'
import { useStepStore } from '@/stores/step'
import type { Step } from '@/stores/step'

const route = useRoute()
const projectStore = useProjectStore()
const stepStore = useStepStore()

const project = computed(() => projectStore.currentProject)
const steps = computed(() => stepStore.steps)
const loading = computed(() => stepStore.loading)

const showCreateStepModal = ref(false)
const editingStep = ref<Step | null>(null)

const form = ref({
  name: '',
  description: '',
})

onMounted(async () => {
  const projectId = Number(route.params.id)
  await projectStore.fetchProject(projectId)
  await stepStore.fetchSteps(projectId)
})

const getStatusText = (statusId: number) => {
  switch (statusId) {
    case 0:
      return 'Success'
    case 1:
      return 'Pending'
    case 2:
      return 'Processing'
    default:
      return 'Unknown'
  }
}

const handleSubmit = async () => {
  try {
    if (editingStep.value) {
      await stepStore.updateStep(editingStep.value.id, form.value)
    } else {
      await stepStore.createStep({
        ...form.value,
        project_id: Number(route.params.id),
      })
    }
    showCreateStepModal.value = false
    form.value = { name: '', description: '' }
    editingStep.value = null
  } catch (error) {
    console.error('Failed to save step:', error)
  }
}

const editStep = (step: Step) => {
  editingStep.value = step
  form.value = {
    name: step.name,
    description: step.description,
  }
  showCreateStepModal.value = true
}

const deleteStep = async (id: number) => {
  if (confirm('Are you sure you want to delete this step?')) {
    try {
      await stepStore.deleteStep(id)
    } catch (error) {
      console.error('Failed to delete step:', error)
    }
  }
}

const editProject = () => {
  // TODO: Implement project editing
}
</script>
