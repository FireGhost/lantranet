<script setup lang="ts">
import type { OrderStatusCreateInput, OrderStatusModel, OrderStatusUpdateInput } from '~~/prisma/generated/prisma/models';

const { data: orderStatuses, refresh: refreshOrderStatus } = await useFetch<OrderStatusModel[]>('/api/buvette/status');
const orderStatusesSorted = computed(() => {
  return orderStatuses.value?.sort((a, b) => a.weight - b.weight);
});

const newOrderStatus = reactive<Partial<OrderStatusCreateInput>>({});
function createOrderStatus() {

  useApi(
    '/api/buvette/status',
    {
      fetchOptions: {
        method: 'POST',
        body: newOrderStatus,
      },
      successString: 'Status created',
      onSuccess: () => {
        newOrderStatus.name = '';
        newOrderStatus.weight = undefined;
        newOrderStatus.color = '';
        refreshOrderStatus();
      },
    }
  );
}

function updateOrderStatus(orderStatus: OrderStatusModel) {
  useApi(
    `/api/buvette/status/${orderStatus.id}`,
    {
      fetchOptions: {
        method: 'PUT',
        body: {
          color: orderStatus.color,
          name: orderStatus.name,
          weight: orderStatus.weight,
        } satisfies OrderStatusUpdateInput,
      },
      successString: 'Status updated',
      onSuccess: refreshOrderStatus,
    }
  );
}

function deleteOrderStatus(orderStatusId: number) {
  useApi(
    `/api/buvette/status/${orderStatusId}`,
    {
      fetchOptions: {
        method: 'DELETE',
      },
      successString: 'Status deleted',
      onSuccess: refreshOrderStatus,
    }
  );
}
</script>

<template>
  <div v-for="orderStatus in orderStatusesSorted" :key="orderStatus.id">
    <UFieldGroup>
      <UInput v-model="orderStatus.weight" type="number" class="w-20" />
      <UInput v-model="orderStatus.name" />
      <UInput v-model="orderStatus.color" />
      <UButton label="Update" color="success" @click="updateOrderStatus(orderStatus)" />
      <UButton label="Delete" color="error" variant="outline" @click="deleteOrderStatus(orderStatus.id)" />
    </UFieldGroup>
  </div>

  <UForm @submit="createOrderStatus()">
    <UFieldGroup class="mt-4">
      <UInput placeholder="Weight" type="number" v-model="newOrderStatus.weight" class="w-20" />
      <UInput placeholder="Status name" v-model="newOrderStatus.name" />
      <UInput placeholder="Color name" v-model="newOrderStatus.color" />
      <UButton label="Add" color="success" type="submit" />
    </UFieldGroup>
  </UForm>
</template>