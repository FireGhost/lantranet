<script setup lang="ts">
import type { ChipProps } from "@nuxt/ui";
import type {
  OrderStatusCreateInput,
  OrderStatusModel,
  OrderStatusUpdateInput,
} from "~~/prisma/generated/prisma/models";

const toast = useToast();

const colors = [
  "primary",
  "secondary",
  "success",
  "info",
  "warning",
  "error",
  "neutral",
];

const { data: orderStatuses, refresh: refreshOrderStatus } = await useFetch<
  OrderStatusModel[]
>("/api/buvette/status", {
  query: { orderByWeight: true },
  deep: true,
});

const newOrderStatus = reactive<Partial<OrderStatusModel>>({});

function addOrderStatus(newOrderStatus: Partial<OrderStatusModel>) {
  if (!newOrderStatus.color || !newOrderStatus.name) {
    toast.add({
      title: "Please enter a name and select a color",
      color: "error",
    });
    return;
  }

  useApi("/api/buvette/status", {
    fetchOptions: {
      method: "POST",
      body: {
        color: newOrderStatus.color,
        name: newOrderStatus.name,
        weight: orderStatuses.value?.length ?? 0,
      } satisfies OrderStatusCreateInput,
    },
    successString: "Status created",
    onSuccess: () => {
      newOrderStatus.name = "";
      newOrderStatus.color = "";
      refreshOrderStatus();
    },
  });
}

function updateOrderStatus(orderStatus: OrderStatusModel) {
  useApi(`/api/buvette/status/${orderStatus.id}`, {
    fetchOptions: {
      method: "PUT",
      body: {
        color: orderStatus.color,
        name: orderStatus.name,
      } satisfies OrderStatusUpdateInput,
    },
    successString: "Status updated",
    onSuccess: () => {
      refreshOrderStatus();
    },
  });
}

function deleteOrderStatus(orderStatusId: number) {
  useApi(`/api/buvette/status/${orderStatusId}`, {
    fetchOptions: {
      method: "DELETE",
    },
    successString: "Status removed",
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
          method: "PUT",
          body: {
            weight: Number(weight),
          } satisfies OrderStatusUpdateInput,
        },
      }),
    );
  }
  Promise.all(promises).then(() => {
    toast.add({ title: "Status order updated" });
    refreshOrderStatus();
  });
}
</script>

<template>
  <AdminFormSortableInputs
    v-slot="{ item: orderStatus }"
    :items="orderStatuses ?? []"
    id-key="id"
    :new-item="newOrderStatus"
    @add-item="addOrderStatus"
    @update-item="updateOrderStatus"
    @delete-item="deleteOrderStatus"
    @order-updated="updateOrderOrderStatus"
  >
    <UInput v-model="orderStatus.name" placeholder="Status name" />

    <USelect
      v-model="orderStatus.color"
      :items="colors"
      placeholder="Select a color"
      class="w-48"
    >
      <template #item-leading="{ item: color }">
        <UChip :color="color as ChipProps['color']" class="m-1" />
      </template>
      <template #leading="{ modelValue: selectedColor }">
        <UChip
          v-if="selectedColor"
          :color="selectedColor as ChipProps['color']"
          class="m-1"
        />
      </template>
    </USelect>
  </AdminFormSortableInputs>
</template>
