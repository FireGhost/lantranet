<script setup lang="ts">
import type { SelectItem } from '@nuxt/ui';
import type { AnimationModel } from '~~/prisma/generated/prisma/models';

definePageMeta({
  layout: 'animations',
  middleware: "need-admin",
});
const emit = defineEmits(['refreshAnimations']);

const toast = useToast();

const { data: users } = await useFetch('/api/users');
const usersItems: ComputedRef<SelectItem[] | undefined> =
  computed(() => users.value?.map((user) => {return {label: user.username, value: user.id}}));

const { data: lanDays } = await useFetch('/api/lan-days');
const lanDaysItems: ComputedRef<SelectItem[] | undefined> =
  computed(() => lanDays.value?.map((lanDay) => {return {label: lanDay.name, value: lanDay.id}}));

const lanAnimationState = reactive<Partial<AnimationModel>>({});
async function submit() {
  $fetch('/api/animations/add', {
    method: 'POST',
    body: lanAnimationState,
  })
  .then((success) => {
    toast.add({title: 'Animation created !'});
    emit('refreshAnimations');
    navigateTo('/animations');
  }, (error) => {
    toast.add({
      title: 'Error while creating animation',
      description: error.data.message,
      color: 'error',
    });
  });
}
</script>

<template>
  <UForm @submit="submit" class="mr-8 mt-4">
    <UFormField label="Name" name="name">
      <UInput v-model="lanAnimationState.name" class="w-80" />
    </UFormField>

    <UFormField label="Short name" name="shortName">
      <UInput v-model="lanAnimationState.shortName" class="w-80" />
    </UFormField>
    
    <UFormField label="Is team based" name="isTeam">
      <USwitch v-model="lanAnimationState.isTeamed" />
    </UFormField>
    
    <UFormField label="Description" name="description">
      <UTextarea :rows="6" v-model="lanAnimationState.description" class="w-full" />
    </UFormField>

    <UFormField label="Admin user" name="adminUser">
      <USelect v-model="lanAnimationState.adminUserId" :items="usersItems" class="w-80" />
    </UFormField>
    
    <UFormField label="Animation day" name="lanDay">
      <USelect v-model="lanAnimationState.lanDayId" :items="lanDaysItems" class="w-80" />
    </UFormField>

    <UFormField label="Start time" name="startTime">
      <UInput v-model="lanAnimationState.startTime" class="w-80" />
    </UFormField>

    <UFormField label="Weight" name="weight">
      <UInputNumber v-model="lanAnimationState.weight" class="w-80" />
    </UFormField>

    <UButton type="submit" class="mt-4">
      Create !
    </UButton>
  </UForm>
</template>
