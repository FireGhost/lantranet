<script setup lang="ts">
import type { OrderGetPayload, OrderStatusModel } from '~~/prisma/generated/prisma/models';

const toast = useToast();

const availableColors = ["error", "neutral", "primary", "secondary", "success", "info", "warning"];

type FetchedOrderType = OrderGetPayload<{
  include: {
    user: true,
    status: true,
    orderItems: true,
  }
}>;
const { data: orders, refresh: refreshOrders } = useFetch<FetchedOrderType[]>('/api/buvette/orders', {
  query: {withUser: true, withStatus: true, withOrderItems: true}
});

const { data: orderStatuses } = await useFetch<OrderStatusModel[]>('/api/buvette/status');
const orderStatusesSorted = computed(() => {
  return orderStatuses.value?.sort((a, b) => a.weight - b.weight) ?? [];
});

type FetchedOrderImproved = FetchedOrderType & {totalPrice: number, nextStatus: OrderStatusModel | undefined};

const ordersImproved = computed(() => {
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
      nextStatus: findNextStatus(order.status),
    });

  });

  return ordersImproved.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
});

const todoOrders = computed(() => ordersImproved.value.filter((order) => findNextStatus(order.status)));
const doneOrders = computed(() => ordersImproved
  .value
  .filter((order) => !findNextStatus(order.status))
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
);

function findNextStatus(orderStatus?: OrderStatusModel | null): OrderStatusModel | undefined {
  if (!orderStatus) {
    return orderStatusesSorted.value.at(0);
  }

  const currentIndex = orderStatusesSorted.value.findIndex((orderStatusToFind) => orderStatusToFind.id === orderStatus.id);
  return orderStatusesSorted.value.at(currentIndex + 1);
}

function updateNextStatus(order: FetchedOrderImproved) {
  order.status = order.nextStatus ?? null;
  order.statusId = order.nextStatus?.id ?? null;
  $fetch('/api/buvette/orders/update', {
    method: 'POST',
    body: order,
  })
  .then((success) => {
    toast.add({title: 'Order updated with success'});
    refreshOrders();
  }, (error) => {
    toast.add({
      title: 'Error while updating order',
      description: error.data.message,
      color: 'error',
    });
  });
}
</script>

<template>
  <UAccordion :items="todoOrders" :ui="{label: 'flex gap-16'}" data-orientation="horizontal">

    <template #default="{item}">
      <div>{{ item.user.username }}</div>
      <NuxtTime :datetime="item.createdAt" locale="fr-CH" date-style="short" time-style="short" />
      <UBadge v-if="item.status" :label="item.status.name" :color="item.status.color" />
      <UBadge v-else label="Sans status" color="neutral" />
      <UButton v-if="item.nextStatus" :label="`Passer à: -> ${item.nextStatus.name}`" color="primary" @click="updateNextStatus(item)" />
      <div>{{ item.orderItems.length }} items</div>
      <div>{{ item.totalPrice }} CHF</div>
    </template>

    <template #content="{item}">
      <UTable :data="item.orderItems.map((orderItem) => {
        return {name: orderItem.nameAtOrder, comment: orderItem.comment, price: `${orderItem.priceAtOrder} CHF`};
      })" />
    </template>

  </UAccordion>

  <UPageHeader title="Done" />
  <UAccordion :items="doneOrders" :ui="{label: 'flex gap-16'}" data-orientation="horizontal">

    <template #default="{item}">
      <div>{{ item.user.username }}</div>
      <NuxtTime :datetime="item.createdAt" locale="fr-CH" date-style="short" time-style="short" />
      <UBadge v-if="item.status" :label="item.status.name" :color="item.status.color" />
      <UBadge v-else label="Sans status" color="neutral" />
      <UButton v-if="item.nextStatus" :label="`Passer à: -> ${item.nextStatus.name}`" color="primary" @click="updateNextStatus(item)" />
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
