<script setup lang="ts">
import type { OrderGetPayload } from '~~/prisma/generated/prisma/models';

definePageMeta({
  layout: 'buvette',
});

const availableColors = ["error", "neutral", "primary", "secondary", "success", "info", "warning"];

type FetchedOrderType = OrderGetPayload<{
  include: {
    orderItems: true,
    status: true
  }
}>;
const { data: orders } = await useFetch<FetchedOrderType[]>('/api/buvette/orders/mine', {
  query: {withOrderItems: true, withStatus: true},
});

type FetchedOrderImproved = FetchedOrderType & {totalPrice: number};

const ordersComputed = computed(() => {
  const ordersImproved: FetchedOrderImproved[] = [];

  orders.value?.forEach((order) => {
    let orderTotal = 0;
    order.orderItems.forEach((orderItem) => {
      orderTotal += orderItem.priceAtOrder;
    });

    if (order.status && availableColors.indexOf(order.status.color) === -1) {
      order.status.color = 'neutral';
    }

    ordersImproved.push({
      ...order,
      totalPrice: orderTotal,
    });
  });

  ordersImproved.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return ordersImproved;
});
</script>

<template>
  <UAccordion :items="ordersComputed" :ui="{label: 'flex gap-16'}">

    <template #default="{item}">
      <NuxtTime :datetime="item.createdAt" locale="fr-CH" date-style="short" time-style="short" />
      <UBadge v-if="item.status" :label="item.status.name" :color="item.status.color" />
      <UBadge v-else label="Sans status" color="neutral" />
      <div>{{ item.orderItems.length }} items</div>
      <div>{{ item.totalPrice }} CHF</div>
    </template>

    <template #content="{item}">
      <UTable :data="item.orderItems.map((orderItem) => {
          return {name: orderItem.nameAtOrder, comment: orderItem.comment, price: `${orderItem.priceAtOrder} CHF`};
        })" />
    </template>

  </UAccordion>
</template>
