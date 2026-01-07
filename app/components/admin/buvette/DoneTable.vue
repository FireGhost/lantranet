<script setup lang="ts">
import type { BadgeProps } from "@nuxt/ui";
import type { OrderGetPayload } from "~~/prisma/generated/prisma/models";

const settingsStrings = useSettingsStrings();

defineProps<{
  orders: OrderGetPayload<{
    include: {
      orderItems: true;
      status: true;
      user: true;
    };
  }>[];
}>();

const datetimeLocale = await settingsStrings.get("app-datetime-locale");
const currencySuffix = await settingsStrings.get("app-currency-suffix");
</script>

<template>
  <UAccordion
    :items="orders"
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
      <UBadge v-else label="$t('no-status')" color="neutral" />
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
