<script setup lang="ts">
import type { OrderGetPayload, OrderUpdateInput } from '~~/prisma/generated/prisma/models';

const props = defineProps<{
  orders: OrderGetPayload<{
    include: {
      orderItems: true,
      status: true,
      user: true,
    }
  }>[]
}>();

const emit = defineEmits<{
  (e: 'orderUpdated'): void,
}>();

const orderStatusesSorted = await getOrderStatusesSorted();

const ordersImproved = computed(() => {
  return props.orders.map((order) => {
    return {
      ...order,
      nextStatus: useFindNextStatus(order.status, orderStatusesSorted.value),
    }
  });
});

function updateNextStatus(order: typeof ordersImproved.value[number]) {
  if (!order.nextStatus) {
    useToast().add({
      title: 'No next status',
      color: 'error',
    });
    return;
  }

  useApi(
    `/api/buvette/orders/${order.id}`,
    {
      fetchOptions: {
        method: 'PUT',
        body: {
          status: {
            connect: {
              id: order.nextStatus.id,
            }
          }
        } satisfies OrderUpdateInput,
      },
      successString: 'Order updated with success',
      onSuccess: () => emit('orderUpdated'),
    }
  );
}
</script>

<template>
  <UAccordion :items="ordersImproved" :ui="{label: 'flex gap-16'}" data-orientation="horizontal">

    <template #default="{item}">
      <div>{{ item.user.username }}</div>
      <NuxtTime :datetime="item.createdAt" locale="fr-CH" date-style="short" time-style="short" />
      <UBadge v-if="item.status" :label="item.status.name" :color="item.status.color" />
      <UBadge v-else label="Sans status" color="neutral" />
      <UButton v-if="item.nextStatus" :label="`Passer à: -> ${item.nextStatus.name}`" color="primary" @click="updateNextStatus(item)" />
      <div>{{ item.orderItems.length }} items</div>
      <div>{{ computeTotalPrice(item) }} CHF</div>
    </template>

    <template #content="{item}">
      <UTable :data="item.orderItems.map((orderItem) => {
        return {name: orderItem.nameAtOrder, comment: orderItem.comment, price: `${orderItem.priceAtOrder} CHF`};
      })" />
    </template>

  </UAccordion>
</template>