<script setup lang="ts">
import type { MenuItemModel, MenuItemUpdateInput } from '~~/prisma/generated/prisma/models';

const toast = useToast();

const { data: menuItems } = await useFetch<MenuItemModel[]>('/api/buvette/menu-items');

function onMenuItemChange(menuItemId: number) {
  const menuItemUpdated = menuItems.value?.find((menuItem) => menuItem.id === menuItemId);
  if (!menuItemUpdated) {
    toast.add({
      title: 'Menu item non-existant',
      color: 'error',
    });
    return;
  }
  menuItemUpdated.isAvailable = !menuItemUpdated?.isAvailable;

  useApi(
    `/api/buvette/menu-items/${menuItemId}`,
    {
      fetchOptions: {
        method: 'PUT',
        body: {
          isAvailable: menuItemUpdated.isAvailable,
        } satisfies MenuItemUpdateInput,
      },
      successString: 'Menu item updated',
    }
  );
}
</script>

<template>
  <div v-for="menuItem in menuItems" :key="menuItem.id">
    <UFieldGroup>
      <UBadge color="neutral" variant="outline" size="lg" :label="menuItem.name" />
      <UBadge color="neutral" variant="outline">
        <USwitch :default-value="menuItem.isAvailable" @change="onMenuItemChange(menuItem.id)" />
      </UBadge>
    </UFieldGroup>
  </div>
</template>