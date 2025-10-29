<script setup lang="ts">
import { useApi } from "~/composables/useApi";

useHead({
  title: "Login",
});

const { fetch: refreshUserSession } = useUserSession();

const userLoginState = reactive<UserLogin>({
  username: "",
  password: "",
});

async function login() {
  useApi("/api/login", {
    fetchOptions: {
      method: "POST",
      body: userLoginState,
    },
    successString: "You are logged in !",
    onSuccess: async () => {
      refreshUserSession();
      navigateTo("/");
    },
  });
}
</script>

<template>
  <div class="pt-4">
    <UPageCard title="Login" class="w-fit m-auto">
      <UForm @submit="login()">
        <UFormField label="Username" name="username">
          <UInput v-model="userLoginState.username" autofocus />
        </UFormField>

        <UFormField label="Password" name="password" class="mt-2">
          <UInput v-model="userLoginState.password" type="password" />
        </UFormField>

        <UButton label="Login" type="submit" class="mt-4" />
      </UForm>
    </UPageCard>
  </div>
</template>
