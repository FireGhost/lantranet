<script setup lang="ts">
import type { ChipProps } from '@nuxt/ui';
import type { OrderStatusCreateInput, OrderStatusModel, OrderStatusUpdateInput } from '~~/prisma/generated/prisma/models';

const toast = useToast();

const colors = [
  "primary",
  "secondary",
  "success",
  "info",
  "warning",
  "error",
  "neutral"
];

const { data: orderStatuses, refresh: refreshOrderStatus } = await useFetch<OrderStatusModel[]>('/api/buvette/status');
const orderStatusesSorted = computed(() => {
  return orderStatuses.value?.sort((a, b) => a.weight - b.weight);
});

const newOrderStatus = reactive<Partial<OrderStatusCreateInput>>({});

function addOrderStatus(newOrderStatus: OrderStatusCreateInput) {
  useApi('/api/buvette/status', {
    fetchOptions: {
      method: 'POST',
      body: {
        ...newOrderStatus,
        weight: orderStatusesSorted.value?.length ?? 0,
      } satisfies OrderStatusCreateInput,
    },
    successString: 'Status created',
    onSuccess: () => {
      newOrderStatus.name = '';
      refreshOrderStatus();
    },
  });
}

function updateOrderStatus(orderStatus: OrderStatusModel) {
  useApi(`/api/buvette/status/${orderStatus.id}`, {
    fetchOptions: {
      method: 'PUT',
      body: {
        color: orderStatus.color,
        name: orderStatus.name,
      } satisfies OrderStatusUpdateInput,
    },
    successString: 'Status updated',
    onSuccess: () => {
      refreshOrderStatus();
    },
  });
}

function deleteOrderStatus(orderStatusId: string) {
  useApi(`/api/buvette/status/${orderStatusId}`, {
    fetchOptions: {
      method: 'DELETE'
    },
    successString: 'Status removed',
    onSuccess: () => {
      refreshOrderStatus();
    },
  });
}

function updateOrderOrderStatus(keysSorted: string[]) {
  const promises = [];
  for (const weight in keysSorted) {
    promises.push(
      useApi(`/api/buvette/status/${keysSorted[weight]}`, {
        fetchOptions: {
          method: 'PUT',
          body: {
            weight: Number(weight)
          } satisfies OrderStatusUpdateInput
        }
      })
    );
  }
  Promise.all(promises).then(() => {
    toast.add({title: 'Status order updated'});
    refreshOrderStatus();
  });
}
</script>

<template>
  <AdminFormSortableInputs
    :items="orderStatusesSorted ?? []"
    id-key="id"
    :new-item="newOrderStatus"
    @add-item="addOrderStatus"
    @update-item="updateOrderStatus"
    @delete-item="deleteOrderStatus"
    @order-updated="updateOrderOrderStatus"
    v-slot="{ item }"
  >
    <UInput v-model="item.name" placeholder="Status name" />

    <USelect v-model="item.color" :items="colors" default-value="primary" class="w-48">
      <template #item-label="{ item }">
        <UChip :color="(item as ChipProps['color'])" class="m-1" /> {{ item }}
      </template>
      <template #default="{ modelValue }">
        <UChip :color="(modelValue as ChipProps['color'])" class="m-1" /> {{ modelValue }}
      </template>
    </USelect>
  </AdminFormSortableInputs>
</template>