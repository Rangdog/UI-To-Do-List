<template>
  <form @submit.prevent="inviteUser" class="flex items-center space-x-2">
    <input v-model="email" type="email" placeholder="Email" class="px-3 py-1 border rounded-md text-sm" required />
    <select v-model="roleId" class="px-2 py-1 border rounded-md text-sm">
      <option disabled value="">Select Role</option>
      <option v-for="role in roles" :key="role.id" :value="role.id">{{ role.title }}</option>
    </select>
    <button type="submit" class="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm">
      Invite
    </button>
  </form>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const props = defineProps({
  projectId: Number
})
const emit = defineEmits(['user-invited'])

const email = ref('')
const roleId = ref('')
const roles = ref([])

const fetchRoles = async () => {
  const res = await axios.get('/api/roles') // adjust this path as needed
  roles.value = res.data
}

const inviteUser = async () => {
  await axios.post('/api/project/invite', {
    email: email.value,
    role_id: roleId.value,
    project_id: props.projectId
  })

  email.value = ''
  roleId.value = ''
  emit('user-invited')
}

onMounted(fetchRoles)
</script>