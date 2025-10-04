<script setup lang="ts">
const toast = useToast();
const { fetch: refreshUserSession } = useUserSession();

const userLoginState = reactive<UserLogin>({
  username: '',
  password: '',
});

async function login() {
  $fetch('/api/login', {
    method: 'POST',
    body: userLoginState
  })
  .then(async (success) => {
    toast.add({title: 'You are now logged in !'});
    await refreshUserSession();
    navigateTo('/');
  }, (error) => {
    toast.add({
      title: 'Error while login',
      description: error.data.message,
      color: 'error',
    });
  });
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
