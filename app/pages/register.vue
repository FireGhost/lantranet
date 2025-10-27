<script setup lang="ts">
const { fetch: refreshUserSession } = useUserSession();

useHead({
  title: "Register",
});

const userLoginState = reactive<UserLogin>({
  username: "",
  password: "",
});

async function register() {
  useApi("/api/register", {
    fetchOptions: {
      method: "POST",
      body: userLoginState,
    },
    successString: "Registration complete !",
    onSuccess: () => {
      refreshUserSession();
      navigateTo("/");
    },
  });
}
</script>

<template>
  <UForm @submit="register()">
    <UFormField label="Username" name="username">
      <UInput v-model="userLoginState.username" />
    </UFormField>

    <UFormField label="Password" name="password">
      <UInput v-model="userLoginState.password" type="password" />
    </UFormField>

    <UButton type="submit"> Register </UButton>
  </UForm>
</template>
