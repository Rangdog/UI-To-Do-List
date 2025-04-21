<template>
  <div class="p-6">
    <h2 class="text-2xl font-semibold mb-4">Task Members</h2>


    <div v-if="loading" class="text-gray-500 flex items-center gap-2">
      <svg class="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none"
        viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
      </svg>
      Loading...
    </div>

    <!-- Cột bên phải -->
    <div class="w-3/3 grid gap-4">
      <div v-for="user in userStepRole" :key="user.id" class="p-4 border rounded-xl shadow-sm">
        <div class="flex items-center justify-between gap-4 p-4 bg-white rounded-lg shadow">
          <!-- User Info -->
          <div class="flex flex-col">
            <p class="font-medium text-gray-900">{{ user.name }}</p>
            <p class="text-sm text-gray-500">{{ user.email }}</p>
          </div>

          <!-- Role & Remove Button nằm cạnh nhau -->
          <div class="flex items-center gap-2">
            <select v-model="user.role_id" @change="() => updateUserRole(user)"
              class="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500">
              <option disabled value="">Select Role</option>
              <option v-for="role in roles" :key="role.id" :value="role.id">
                {{ role.title }}
              </option>
            </select>

            <button @click="removeOfTaskMember(user.email, taskId)"
              class="text-sm font-medium text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-md transition">
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted, computed, reactive, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStepStore } from '@/stores/step'
import { useUserRoleStore } from '@/stores/userRole'
import { useToast } from 'vue-toastification'

const stepStore = useStepStore()
const userRoleStore = useUserRoleStore()
const route = useRoute()
const users = computed(() => userRoleStore.usersRole)
const usersNotRole = computed(() => userRoleStore.usersNotRole)
const userInvitedPending = computed(() => userRoleStore.userInvitedPending)
const userStepRole = computed(() => userRoleStore.userStepRole)
const roles = computed(() => userRoleStore.roles)
const username = ref('')
const roleSlug = ref('')
const toast = useToast()

interface Role {
  id: number;
  name: string;
  slug: string;
}


const loading = computed(() => userRoleStore.loading)

const taskId = Number(route.params.id)
onMounted(async () => {
  // await projectStore.fetchProject(projectId)

  await userRoleStore.fetchUsersRoleTask(taskId)
  await userRoleStore.fetchRole()
  console.log(userStepRole.value)
})

const updateUserRole = async (user: any) => {
  const selectedRole = roles.value.find(r => r.id === user.role_id);
  const roleTitle = selectedRole ? selectedRole.title : null;
  const res = await userRoleStore.updateUserRole({ userId: user.user_id, taskId: taskId, Slug: roleTitle || "" })
  if (res?.status) {
    toast.success(res.msg + "!")
  } else {
    toast.error(res?.msg + "!")
  }
  await userRoleStore.fetchUsersRoleTask(taskId)
}


const removeOfTaskMember = async (email: string, taskId: number) => {
  const res = await userRoleStore.remove(email, taskId)
  if (typeof res === 'object' && res !== null && 'status' in res) {
    if (res.status) {
      toast.success(res.msg + "!")
    } else {
      toast.error(res.msg + "!")
    }
  } else {
    toast.error("Something went wrong!")
  }
  await userRoleStore.fetchUsersRoleTask(taskId)

}



</script>