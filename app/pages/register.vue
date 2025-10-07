<script setup lang="ts">
const toast = useToast();
const { fetch: refreshUserSession } = useUserSession();

const userLoginState = reactive<UserLogin>({
  username: '',
  password: '',
});

async function register() {
  $fetch('/api/register', {
    method: 'POST',
    body: userLoginState,
  })
  .then(async (success) => {
    toast.add({title: 'Registration complete !'});
    await refreshUserSession();
    navigateTo('/');
  }, (error) => {
    toast.add({
      title: 'Error during registration',
      description: error.data.message,
      color: 'error',
    });
  });
}
</script>

<template>
  <UForm @submit="register()">
    <UFormField label="Username" name="username">
      <UInput v-model="userLoginState.username" />
    </UFormField>

    <UFormField label="Password" name="password">
      <UInput type="password" v-model="userLoginState.password" />
    </UFormField>

    <UButton type="submit">
      Register
    </UButton>
  </UForm>
</template>
