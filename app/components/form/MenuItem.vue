<script setup lang="ts">
import type { SelectItem } from '@nuxt/ui';
import type { MenuCategoryModel, MenuItemModel } from '~~/prisma/generated/prisma/models';

const props = defineProps<{
  menuItem: Partial<MenuItemModel>
}>();
const menuItemState = ref(props.menuItem);

const { data: menuCategories } = await useFetch('/api/buvette/categories', {
  transform: (data: MenuCategoryModel[]): SelectItem[] => data.map((menuCategory) => ({
    label: menuCategory.name,
    value: menuCategory.id,
  }))
});

const formSubmit = props.menuItem.id ? updateMenuItem : createMenuItem;
const submitButtonText = props.menuItem.id ? 'Update' : 'Create';

function createMenuItem() {
  useApi(
    '/api/buvette/menu-items/add',
    {
      fetchOptions: {
        method: 'POST',
        body: menuItemState.value,
      },
      successString: 'Item created !',
      onSuccess: () => navigateTo('/buvette'),
    }
  );
}

function updateMenuItem() {
  useApi(
    '/api/buvette/menu-items/update',
    {
      fetchOptions: {
        method: 'POST',
        body: menuItemState.value,
      },
      successString: 'Item updated !',
      onSuccess: () => navigateTo('/buvette'),
    }
  );
}
</script>

<template>
  <UForm @submit="formSubmit()">

    <UFormField label="Name">
      <UInput v-model="menuItemState.name" class="w-80" />
    </UFormField>
    
    <UFormField label="Description">
      <UTextarea v-model="menuItemState.description" class="w-80" :rows="7" />
    </UFormField>

    <UFormField label="Price">
      <UInputNumber v-model="menuItemState.price" :format-options="{minimumFractionDigits: 0.5, style: 'decimal'}" :step="0.5" />
    </UFormField>

    <UFormField label="Is available">
      <USwitch v-model="menuItemState.isAvailable" />
    </UFormField>

    <UFormField label="Category">
      <USelect :items="menuCategories" v-model="menuItemState.categoryId" class="w-52" />
    </UFormField>

    <UButton type="submit" class="mt-4">{{ submitButtonText }}</UButton>

  </UForm>
</template>