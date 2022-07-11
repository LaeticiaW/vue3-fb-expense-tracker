<template>
  <div class="page">
    <page-header title="Login" />

    <div class="page-content">
      <q-form ref="form" class="form">
        <q-select
          v-model="userId"
          dense
          outlined
          :options="users"
          option-label="userId"
          option-value="userId"
          label="Users"
          :rules="[ValidationUtil.isRequired]"
        />
        <q-btn elevated color="primary" class="login-button" @click="login">Login</q-btn>
      </q-form>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import PageHeader from '@/components/common/PageHeader.vue'
  import UserService from '@/services/user'
  import router from '@/router'
  import { User } from '@/types/user'
  import { useUserStore } from '@/store/user'
  import ValidationUtil from '@/util/validation'
  import { QForm } from 'quasar'

  const userId = ref('')
  const users = ref<User[]>([])
  const form = ref<QForm | null>(null)

  const userStore = useUserStore()

  getUsers()

  async function getUsers() {
    try {
      users.value = await UserService.getUsers()
    } catch (error) {
      console.error('Error retrieving users:', error)
    }
  }

  async function login() {
    form.value?.validate().then(async (success) => {
      if (success) {
        try {
          await userStore.login(userId.value)
          router.push({ name: 'Dashboard' })
        } catch (error) {
          console.error('Error routing to Dashboard after login:', error)
        }
      }
    })
  }
</script>

<style lang="scss" scoped>
  .form {
    padding-top: 100px;
    width: 200px;
    margin: auto;
  }
</style>
