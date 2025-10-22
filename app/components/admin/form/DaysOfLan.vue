<script setup lang="ts">
import type { LanDayCreateInput, LanDayModel, LanDayUpdateInput } from '~~/prisma/generated/prisma/models';

const { data: lanDays, refresh: refreshLanDays } = await useFetch<LanDayModel[]>('/api/lan-days');
const lanDaysSorted = computed(() => lanDays.value?.toSorted((a, b) => a.weight - b.weight));

const newLanDay = reactive<Partial<LanDayCreateInput>>({});
function addLanDay() {
  useApi(
    '/api/lan-days',
    {
      fetchOptions: {
        method: 'POST',
        body: newLanDay,
      },
      successString: 'New day added',
      onSuccess: () => {
        newLanDay.name = '';
        refreshLanDays();
      },
    }
  )
}

function deleteLanDay(lanDay: LanDayModel) {
  useApi(
    `/api/lan-days/${lanDay.id}`,
    {
      fetchOptions: {
        method: 'DELETE',
      },
      successString: 'Day removed',
      onSuccess: refreshLanDays,
    }
  );
}

function updateLanDay(lanDay: LanDayModel, operation: 'up' | 'down' | 'edit') {
  switch(operation) {
    case 'up':
      lanDay.weight--;
      break;

    case 'down':
      lanDay.weight++;
      break;
  }

  useApi(
    `/api/lan-days/${lanDay.id}`,
    {
      fetchOptions: {
        method: 'PUT',
        body: {
          name: lanDay.name,
          weight: lanDay.weight,
        } satisfies LanDayUpdateInput
      },
      successString: 'Day updated',
      onSuccess: refreshLanDays,
    }
  );
}
</script>

<template>
  <div class="flex flex-col">
    <UFieldGroup v-for="lanDay in lanDaysSorted" :key="lanDay.id">
      <UButton label="Up" color="info" @click="updateLanDay(lanDay, 'up')" />
      <UButton label="Down" color="info" @click="updateLanDay(lanDay, 'down')" />
      <UInput :value="lanDay.name" />
      <UButton label="Update" color="success" @click="updateLanDay(lanDay, 'edit')" />
      <UButton label="Del" color="error" @click="deleteLanDay(lanDay)" />
    </UFieldGroup>
  </div>

  <UForm @submit="addLanDay()" class="mt-4">
    <UFormField name="name">
      <UFieldGroup>
        <UInput placeholder="Enter day" v-model="newLanDay.name" />
        <UButton label="Add" color="success" type="submit" />
      </UFieldGroup>
    </UFormField>
  </UForm>
</template>