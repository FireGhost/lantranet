<script setup lang="ts">
import type { OrderGetPayload } from '~~/prisma/generated/prisma/models';

definePageMeta({
  layout: 'buvette',
});

const { data: orders } = await useFetch<OrderGetPayload<{
  include: {
    orderItems: true,
    status: true,
  }
}>[]>('/api/buvette/orders/mine', {
  query: {withOrderItems: true, withStatus: true},
  transform: (data) => {
    return data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
});
</script>

<template>
  <UAccordion :items="orders" :ui="{label: 'flex gap-16'}">

    <template #default="{item}">
      <NuxtTime :datetime="item.createdAt" locale="fr-CH" date-style="short" time-style="short" />
      <UBadge v-if="item.status" :label="item.status.name" :color="item.status.color" />
      <UBadge v-else label="Sans status" color="neutral" />
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
