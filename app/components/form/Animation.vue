<script setup lang="ts">
import type { SelectItem } from "@nuxt/ui";
import type {
  LanDayModel,
  AnimationModel,
  UserModel,
} from "~~/prisma/generated/prisma/models";

const props = defineProps<{
  animation: Partial<AnimationModel>;
}>();
const animationState = ref(props.animation);

const { data: users } = await useFetch("/api/users", {
  transform: (data: UserModel[]): SelectItem[] =>
    data.map((user) => ({
      label: user.username,
      value: user.id,
    })),
});
const { data: lanDays } = await useFetch("/api/lan-days", {
  transform: (data: LanDayModel[]): SelectItem[] =>
    data.map((lanDay) => ({
      label: lanDay.name,
      value: lanDay.id,
    })),
});

const submitFunction = props.animation.id ? updateAnimation : createAnimation;
const submitButtonText = props.animation.id ? $t("Update") : $t("Create");

function createAnimation() {
  useApi("/api/animations", {
    fetchOptions: {
      method: "POST",
      body: animationState.value,
    },
    successString: $t("Animation created with success !"),
    onSuccess: () => {
      refreshNuxtData("animationsList");
      navigateTo("/animations");
    },
  });
}

function updateAnimation() {
  useApi(`/api/animations/${props.animation.id}`, {
    fetchOptions: {
      method: "PUT",
      body: animationState.value,
    },
    successString: $t("Animation updated !"),
    onSuccess: () => {
      refreshNuxtData("animationsList");
      navigateTo(`/animations/${props.animation.id}`);
    },
  });
}
</script>

<template>
  <UForm class="mr-8 mt-4" @submit="submitFunction()">
    <UFormField :label="$t('Name')">
      <UInput v-model="animationState.name" class="w-80" />
    </UFormField>

    <UFormField :label="$t('Short name')">
      <UInput v-model="animationState.shortName" class="w-80" />
    </UFormField>

    <UFormField :label="$t('Is team based')">
      <USwitch v-model="animationState.isTeamed" />
    </UFormField>

    <UFormField :label="$t('Description')">
      <UTextarea
        v-model="animationState.description"
        :rows="6"
        class="w-full"
      />
    </UFormField>

    <UFormField :label="$t('Admin user')">
      <USelect
        v-model="animationState.adminUserId"
        :items="users"
        class="w-80"
      />
    </UFormField>

    <UFormField :label="$t('Animation day')">
      <USelect
        v-model="animationState.lanDayId"
        :items="lanDays"
        class="w-80"
      />
    </UFormField>

    <UFormField :label="$t('Start time')">
      <UInput v-model="animationState.startTime" class="w-80" />
    </UFormField>

    <UFormField :label="$t('Weight')">
      <UInputNumber v-model="animationState.weight" class="w-80" />
    </UFormField>

    <UButton type="submit" class="mt-4">{{ submitButtonText }}</UButton>
  </UForm>
</template>
