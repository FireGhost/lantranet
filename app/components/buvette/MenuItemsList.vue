<script setup lang="ts">
import { Role } from '~~/prisma/generated/prisma/enums';
import type { MenuCategoryGetPayload, OrdersItemsCreateManyOrderInput } from '~~/prisma/generated/prisma/models';

const emit = defineEmits<{
  (e: 'addToCart', orderItem: OrdersItemsCreateManyOrderInput): void,
}>()

const { user } = useUserSession();

const { data: menuCategories, refresh: refreshMenuItems } = await useFetch<MenuCategoryGetPayload<{
  include: {
    menuItems: true
  }
}>[]>('/api/buvette/categories', {
  query: {withMenuItems: true},
});
const menuCategoriesComputed = computed(() => {
  return menuCategories.value?.map((menuCategory) => {
    menuCategory.menuItems = menuCategory.menuItems.filter((menuItem) => menuItem.isAvailable === true);
    return menuCategory;
  })
  .filter((menuCategory) => menuCategory.menuItems.length !== 0);
});

const isAdmin = user.value?.role === Role.ADMIN;
</script>

<template>
  <UButton v-if="isAdmin" label="Add new entry" to="/buvette/menu-items/add" />

  <template v-for="menuCategory in menuCategoriesComputed" :key="menuCategory.id">
    <UPageHeader :title="menuCategory.name" />
    <UPageGrid>

      <UBlogPost v-for="menuItem in menuCategory.menuItems" :key="menuItem.id" :title="menuItem.name" :description="`CHF ${menuItem.price}`">
        <template #footer>

          <BuvetteMenuItem :menu-item="menuItem" @add-to-cart="(orderItem) => $emit('addToCart', orderItem)" @menu-items-updated="refreshMenuItems()" />

        </template>
      </UBlogPost>

    </UPageGrid>
  </template>
</template>