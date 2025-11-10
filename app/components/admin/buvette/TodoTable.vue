<script setup lang="ts">
import type { BadgeProps } from "@nuxt/ui";
import type {
  OrderGetPayload,
  OrderUpdateInput,
} from "~~/prisma/generated/prisma/models";

const settingsStrings = useSettingsStrings();

const props = defineProps<{
  orders: OrderGetPayload<{
    include: {
      orderItems: true;
      status: true;
      user: true;
    };
  }>[];
}>();

const emit = defineEmits<{
  (e: "orderUpdated"): void;
}>();

const orderStatusesSorted = await getOrderStatusesSorted();
const currencySuffix = await settingsStrings.get('app-currency-suffix');
const datetimeLocale = await settingsStrings.get('app-datetime-locale');

const ordersImproved = computed(() => {
  return props.orders.map((order) => {
    return {
      ...order,
      nextStatus: useFindNextStatus(order.status, orderStatusesSorted.value),
    };
  });
});

function updateNextStatus(order: (typeof ordersImproved.value)[number]) {
  if (!order.nextStatus) {
    useToast().add({
      title: $t("No next status"),
      color: "error",
    });
    return;
  }

  useApi(`/api/buvette/orders/${order.id}`, {
    fetchOptions: {
      method: "PUT",
      body: {
        status: {
          connect: {
            id: order.nextStatus.id,
          },
        },
      } satisfies OrderUpdateInput,
    },
    successString: $t("Order updated with success"),
    onSuccess: () => emit("orderUpdated"),
  });
}
</script>

<template>
  <UAccordion
    :items="ordersImproved"
    :ui="{ label: 'flex gap-16' }"
    data-orientation="horizontal"
  >
    <template #default="{ item }">
      <div>{{ item.user.username }}</div>
      <NuxtTime
        :datetime="item.createdAt"
        :locale="datetimeLocale"
        date-style="short"
        time-style="short"
      />
      <UBadge
        v-if="item.status"
        :label="item.status.name"
        :color="item.status.color as BadgeProps['color']"
      />
      <UBadge v-else label="Sans status" color="neutral" />
      <UButton
        v-if="item.nextStatus"
        :label="`${$t('Go to ->')} ${item.nextStatus.name}`"
        color="primary"
        @click.stop="updateNextStatus(item)"
      />
      <div>{{ item.orderItems.length }} {{ $t("items") }}</div>
      <div>{{ computeTotalPrice(item) }} {{ currencySuffix }}</div>
    </template>

    <template #content="{ item }">
      <UTable
        :data="
          item.orderItems.map((orderItem) => {
            return {
              name: orderItem.nameAtOrder,
              comment: orderItem.comment,
              price: `${orderItem.priceAtOrder} ${currencySuffix}`,
            };
          })
        "
      />
    </template>
  </UAccordion>
</template>
