<script setup lang="ts">
const { fetch: refreshUserSession } = useUserSession();

useHead({
  title: $t("Register"),
});

const userRegisterState = reactive<Partial<UserRegisterInput>>({});

async function register() {
  useApi("/api/register", {
    fetchOptions: {
      method: "POST",
      body: userRegisterState,
    },
    successString: $t("Registration complete !"),
    onSuccess: () => {
      refreshUserSession();
      navigateTo("/");
    },
  });
}
</script>

<template>
  <div class="pt-4">
    <UPageCard highlight :title="$t('Register a new user')" class="w-fit m-auto mt-4">
      <UForm :schema="UserRegisterSchema" :state="userRegisterState" @submit="register()">
        <UFormField :label="$t('Username')" name="username">
          <UInput v-model="userRegisterState.username" />
        </UFormField>

        <UFormField :label="$t('Password')" name="password" class="mt-2">
          <UInput v-model="userRegisterState.password" type="password" />
        </UFormField>

        <UFormField :label="$t('Password confirmation')" name="passwordConfirm" class="mt-2">
          <UInput v-model="userRegisterState.passwordConfirm" type="password" />
        </UFormField>

        <UButton type="submit" class="mt-4">{{ $t("Register") }}</UButton>
      </UForm>
    </UPageCard>
  </div>
</template>
