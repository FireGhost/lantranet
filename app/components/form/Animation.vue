<script setup lang="ts">
import type { SelectItem } from '@nuxt/ui';
import type { LanDayModel, AnimationModel, UserModel } from '~~/prisma/generated/prisma/models';

const props = defineProps<{
  animation: Partial<AnimationModel>,
}>();
const animationState = ref(props.animation);

const { data: users } = await useFetch('/api/users', {
  transform: (data: UserModel[]): SelectItem[] => data.map((user) => ({
    label: user.username,
    value: user.id,
  })),
});
const { data: lanDays } = await useFetch('/api/lan-days', {
  transform: (data: LanDayModel[]): SelectItem[] => data.map((lanDay) => ({
    label: lanDay.name,
    value: lanDay.id,
  })),
});

const submitFunction = props.animation.id ? updateAnimation : createAnimation;
const submitButtonText = props.animation.id ? 'Update' : 'Create';

function createAnimation() {
  useApi(
    '/api/animations/add', {
      fetchOptions: {
        method: 'POST',
        body: animationState.value,
      },
      successString: 'Animation created with success !',
      onSuccess: () => {
        refreshNuxtData('animationsList');
        navigateTo('/animations');
      },
    }
  );
}

function updateAnimation() {
  useApi(
    '/api/animations/update',
    {
      fetchOptions: {
        method: 'POST',
        body: animationState.value,
      },
      successString: 'Animation updated !',
      onSuccess: () => {
        refreshNuxtData('animationsList');
        navigateTo(`/animations/${animationState.value.id}`);
      },
    }
  );
}
</script>

<template>
  <UForm @submit="submitFunction()" class="mr-8 mt-4">
    <UFormField label="Name">
      <UInput v-model="animationState.name" class="w-80" />
    </UFormField>

    <UFormField label="Short name">
      <UInput v-model="animationState.shortName" class="w-80" />
    </UFormField>
    
    <UFormField label="Is team based">
      <USwitch v-model="animationState.isTeamed" />
    </UFormField>
    
    <UFormField label="Description">
      <UTextarea :rows="6" v-model="animationState.description" class="w-full" />
    </UFormField>

    <UFormField label="Admin user">
      <USelect v-model="animationState.adminUserId" :items="users" class="w-80" />
    </UFormField>
    
    <UFormField label="Animation day">
      <USelect v-model="animationState.lanDayId" :items="lanDays" class="w-80" />
    </UFormField>

    <UFormField label="Start time">
      <UInput v-model="animationState.startTime" class="w-80" />
    </UFormField>

    <UFormField label="Weight">
      <UInputNumber v-model="animationState.weight" class="w-80" />
    </UFormField>

    <UButton type="submit" class="mt-4">{{ submitButtonText }}</UButton>
  </UForm>
</template>