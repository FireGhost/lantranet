<script setup lang="ts">
import type { LanDayCreateInput, LanDayModel, LanDayUpdateInput } from '~~/prisma/generated/prisma/models';

const toast = useToast();

const { data: lanDays, refresh: refreshLanDays } = await useFetch<LanDayModel[]>('/api/lan-days');
const lanDaysSorted = computed(() => lanDays.value?.toSorted((a, b) => a.weight - b.weight));

const newLanDay = reactive<Partial<LanDayCreateInput>>({});

function deleteLanDay(lanDayId: string) {
  useApi(`/api/lan-days/${lanDayId}`, {
    fetchOptions: {
      method: 'DELETE',
    },
    successString: 'Day removed',
    onSuccess: () => refreshLanDays(),
  });
}

function lanDayOrderUpdated(newKeysOrder: string[]) {
  const promises = [];
  for (const weight in newKeysOrder) {
    promises.push(
      useApi(`/api/lan-days/${newKeysOrder[weight]}`, {
        fetchOptions: {
          method: 'PUT',
          body: {
            weight: Number(weight),
          } satisfies LanDayUpdateInput,
        },
      })
    );
  }
  Promise.all(promises).then(() => {
    toast.add({
      title: 'Order saved'
    });
    refreshLanDays();
  });
}

function updateLanDay(lanDay: LanDayModel) {
  useApi(`/api/lan-days/${lanDay.id}`, {
    fetchOptions: {
      method: 'PUT',
      body: {
        name: lanDay.name,
      } satisfies LanDayUpdateInput
    },
    successString: 'Day updated',
    onSuccess: () => refreshLanDays(),
  });
}

function createLanDay(newLanDay: LanDayCreateInput) {
  useApi('/api/lan-days', {
    fetchOptions: {
      method: 'POST',
      body: newLanDay,
    },
    successString: 'New day added',
    onSuccess: () => {
      newLanDay.name = '';
      refreshLanDays();
    },
  });
}
</script>

<template>
  <AdminFormSortableInputs
    :items="lanDaysSorted ?? []"
    id-key="id"
    :new-item="newLanDay"
    v-slot="{ item }"
    @add-item="createLanDay"
    @update-item="updateLanDay"
    @delete-item="deleteLanDay"
    @order-updated="lanDayOrderUpdated"
  >
    <UInput v-model="item.name" placeholder="Lan day name" />
  </AdminFormSortableInputs>
</template>