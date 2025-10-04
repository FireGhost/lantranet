<script setup lang="ts">
import type { SelectItem } from '@nuxt/ui';
import type { Animation } from '@prisma/client';

definePageMeta({
  layout: 'animations',
  middleware: "need-admin",
});
const emit = defineEmits(['refreshAnimations']);

const toast = useToast();
const route = useRoute();

const { data: users } = await useFetch('/api/users');
const usersItems: ComputedRef<SelectItem[] | undefined> =
  computed(() => users.value?.map((user) => {return {label: user.username, value: user.id}}));

const { data: lanDays } = await useFetch('/api/lan-days');
const lanDaysItems: ComputedRef<SelectItem[] | undefined> =
  computed(() => lanDays.value?.map((lanDay) => {return {label: lanDay.name, value: lanDay.id}}));

const { data: animation } = await useFetch<Animation>(`/api/animations/${route.params.id}`);
const animationState = reactive<Partial<Animation>>(animation.value ?? {});
async function updateAnimation() {
  $fetch('/api/animations/update', {
    method: 'POST',
    body: animationState,
  })
  .then((success) => {
    toast.add({title: 'Animation created !'});
    emit('refreshAnimations');
    navigateTo(`/animations/${route.params.id}`);
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
  <UForm @submit="updateAnimation()" class="mr-8 mt-4">
    <UFormField label="Name" name="name">
      <UInput v-model="animationState.name" class="w-80" />
    </UFormField>

    <UFormField label="Short name" name="shortName">
      <UInput v-model="animationState.shortName" class="w-80" />
    </UFormField>
    
    <UFormField label="Is team based" name="isTeam">
      <USwitch v-model="animationState.isTeamed" />
    </UFormField>
    
    <UFormField label="Description" name="description">
      <UTextarea :rows="6" v-model="animationState.description" class="w-full" />
    </UFormField>

    <UFormField label="Admin user" name="adminUser">
      <USelect v-model="animationState.adminUserId" :items="usersItems" class="w-80" />
    </UFormField>
    
    <UFormField label="Animation day" name="lanDay">
      <USelect v-model="animationState.lanDayId" :items="lanDaysItems" class="w-80" />
    </UFormField>

    <UFormField label="Start time" name="startTime">
      <UInput v-model="animationState.startTime" class="w-80" />
    </UFormField>

    <UFormField label="Weight" name="weight">
      <UInputNumber v-model="animationState.weight" class="w-80" />
    </UFormField>

    <UButton type="submit" class="mt-4">
      Update !
    </UButton>
  </UForm>
</template>
