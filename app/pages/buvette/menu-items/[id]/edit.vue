<script setup lang="ts">
import type { MenuItemModel } from '~~/prisma/generated/prisma/models';

useHead({
  title: 'Edit menu item',
});

definePageMeta({
  layout: 'buvette',
  middleware: 'need-admin',
});

const route = useRoute();

const { data: menuItem } = await useFetch<MenuItemModel>(`/api/buvette/menu-items/${route.params.id}`);
</script>

<template>
  <FormMenuItem :menu-item="menuItem ?? {}" />
</template>