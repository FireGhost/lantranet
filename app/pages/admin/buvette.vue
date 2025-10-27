<script setup lang="ts">
import type { OrderGetPayload } from "~~/prisma/generated/prisma/models";

useHead({
  title: "Buvette admin",
});

const { data: orders, refresh: refreshOrders } = await useFetch<
  OrderGetPayload<{
    include: {
      orderItems: true;
      user: true;
      status: true;
    };
  }>[]
>("/api/buvette/orders", {
  query: { withUser: true, withStatus: true, withOrderItems: true },
  default: () => [],
});
const orderStatusesSorted = await getOrderStatusesSorted();

const doneOrders = computed(() =>
  orders.value
    .filter(
      (order) =>
        useFindNextStatus(order.status, orderStatusesSorted.value) ===
        undefined,
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    ),
);

const todoOrders = computed(() =>
  orders.value
    .filter(
      (order) =>
        useFindNextStatus(order.status, orderStatusesSorted.value) !==
        undefined,
    )
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    ),
);
</script>

<template>
  <div>
    <AdminBuvetteTodoTable
      :orders="todoOrders"
      @order-updated="refreshOrders()"
    />

    <UPageHeader title="Done" />
    <AdminBuvetteDoneTable :orders="doneOrders" />
  </div>
</template>
