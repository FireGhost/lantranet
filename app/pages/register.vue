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
  <div class="pt-4">
    <UPageCard highlight title="Register a new user" class="w-fit m-auto mt-4">
      <UForm @submit="register()">
        <UFormField label="Username" name="username">
          <UInput v-model="userLoginState.username" />
        </UFormField>

        <UFormField label="Password" name="password" class="mt-2">
          <UInput v-model="userLoginState.password" type="password" />
        </UFormField>

        <UButton type="submit" class="mt-4">Register</UButton>
      </UForm>
    </UPageCard>
  </div>
</template>
