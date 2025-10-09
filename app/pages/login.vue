<script setup lang="ts">
import { useApi } from '~/composables/useApi';

const { fetch: refreshUserSession } = useUserSession();

const userLoginState = reactive<UserLogin>({
  username: '',
  password: '',
});

async function login() {
  useApi(
    '/api/login',
    {
      fetchOptions: {
        method: 'POST',
        body: userLoginState
      },
      onSuccess: async () => {
        refreshUserSession();
        navigateTo('/');
      },
      successString: 'You are logged in !',
    }
  );
}
</script>

<template>
  <UPageCard title="Login">
    <UForm @submit="login()">
      <UFormField label="Username" name="username">
        <UInput v-model="userLoginState.username" />
      </UFormField>

      <UFormField label="Password" name="password">
        <UInput type="password" v-model="userLoginState.password" />
      </UFormField>

      <UButton label="Login" type="submit" />
    </UForm>
  </UPageCard>
</template>
