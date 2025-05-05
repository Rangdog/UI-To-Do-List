<template>
  <div class="p-6">
    <h2 class="text-2xl font-semibold mb-4">Project Members</h2>

    <div class="mb-6">
      <form @submit.prevent="inviteUser" class="flex items-center space-x-2">
        <input v-model="username" type="username" placeholder="name or email"
          class="px-3 py-1 border rounded-md text-sm" required />
        <select v-model="roleSlug" class="px-2 py-1 border rounded-md text-sm">
          <option disabled value="">Select Role</option>
          <option v-for="role in roles" :key="role.id" :value="role.title">{{ role.title }}</option>
        </select>
        <button type="submit" class="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm">
          Invite
        </button>
      </form>
    </div>

    <div v-if="loading" class="text-gray-500 flex items-center gap-2">
      <svg class="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none"
        viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
      </svg>
      Loading...
    </div>

    <div v-else class="flex gap-6">
      <!-- Cột bên trái -->
      <div class="w-1/3 p-4 border rounded-xl shadow-sm flex flex-col justify-between items-center">
        <!-- Nội dung bên trái bạn sẽ thêm vào sau -->
        <p>INVITE</p>
        <div v-for="user in userInvitedPending" :key="user.id" class="shadow-sm">
          <div class="">
            <div v-if="user.Status == 'Pending'" class="mt-4 p-4 bg-yellow-100 border rounded-xl min-h-30 min-w-60">
              <div>
                <p class="text-sm text-gray-500">Email: {{ user.Email }}</p>
                <p class="text-sm text-gray-500">Invite time: {{ formatDate(user.CreatedAt) }}</p>
                <p class="text-sm text-gray-500">Status: {{ user.Status }}</p>
              </div>
            </div>
            <div v-else-if="user.Status == 'Accepted'"
              class="mt-4 p-4 bg-green-100 border rounded-xl min-h-30 min-w-60">
              <div>
                <p class="text-sm text-gray-500">Email: {{ user.Email }}</p>
                <p class="text-sm text-gray-500">Invite time: {{ formatDate(user.CreatedAt) }}</p>
                <p class="text-sm text-gray-500">Status: {{ user.Status }}</p>
              </div>
            </div>
            <div v-else class="mt-4 p-4 bg-red-100 border rounded-xl min-h-30 min-w-60">
              <div>
                <p class="text-sm text-gray-500">Email: {{ user.Email }}</p>
                <p class="text-sm text-gray-500">Invite time: {{ formatDate(user.CreatedAt) }}</p>
                <p class="text-sm text-gray-500">Status: {{ user.Status }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Cột bên phải -->
      <div class="w-2/3 gap-4">
        <div v-for="(user, index) in users" :key="user.id" :class="[
          'p-4 border rounded-xl shadow-sm h-30',
          index > 0 ? 'mt-4' : ''
        ]">
          <div class="flex items-center justify-between gap-4 p-4 bg-white rounded-lg shadow">
            <!-- User Info -->
            <div class="flex flex-col">
              <p class="font-medium text-gray-900">{{ user.User.name }}</p>
              <p class="text-sm text-gray-500">{{ user.User.email }}</p>
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

              <button @click="removeOfProjectMember(user.User.email, projectId)"
                class="text-sm font-medium text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-md transition">
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted, computed, reactive, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useProjectStore } from '@/stores/project'
import { useUserRoleStore } from '@/stores/userRole'
import dayjs from 'dayjs'
import { useToast } from 'vue-toastification'

function formatDate(dateString: string) {
  return dayjs(dateString).format('DD/MM/YYYY HH:mm:ss')
}
const projectStore = useProjectStore()
const userRoleStore = useUserRoleStore()
const route = useRoute()
const toast = useToast()
const users = computed(() => userRoleStore.usersRole)
const usersNotRole = computed(() => userRoleStore.usersNotRole)
const userInvitedPending = computed(() => userRoleStore.userInvitedPending)
const roles = computed(() => userRoleStore.roles)
const username = ref('')
const roleSlug = ref('')



const loading = computed(() => userRoleStore.loading)

const projectId = Number(route.params.id)
onMounted(async () => {
  // await projectStore.fetchProject(projectId)
  await userRoleStore.fetchUsersRole(projectId)
  await userRoleStore.fetchUsersNotRole(projectId)
  await userRoleStore.fetchInvite(projectId)
  await userRoleStore.fetchRole()
})

const updateUserRole = async (user: any) => {
  const selectedRole = roles.value.find(r => r.id === user.role_id);
  const roleTitle = selectedRole ? selectedRole.title : null;
  const res = await userRoleStore.updateUserRole({ userId: user.User.id, projectId: projectId, Slug: roleTitle || "" })
  if (res?.status) {
    toast.success("Updated Role")
  } else {
    toast.error(res?.msg + "!")
  }
  await userRoleStore.fetchUsersRole(projectId)
}

const inviteUser = async () => {
  if (roleSlug.value == "") {
    toast.warning("Have to select a role!")
    return
  }

  const res = await userRoleStore.invite({
    username: username.value,
    ProjectId: projectId,
    RoleSlug: roleSlug.value,
  })
  if (res?.status) {
    toast.success("Invited!")
  } else {
    toast.error(res?.msg + "!")
  }
  username.value = ''
  roleSlug.value = ''
  await userRoleStore.fetchInvite(projectId)

}

const removeOfProjectMember = async (email: string, projectId: number) => {
  const res = await userRoleStore.remove(email, undefined, projectId, undefined)
  if (typeof res === 'object' && res !== null && 'status' in res) {
    if (res.status) {
      toast.success(res.msg + "!")
    } else {
      toast.error(res.msg + "!")
    }
  } else {
    toast.error("Something went wrong!")
  }
  await userRoleStore.fetchUsersRole(projectId)

}

</script>