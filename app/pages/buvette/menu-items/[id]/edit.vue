<script setup lang="ts">
import type { MenuCategoryModel, MenuItemModel } from '~~/prisma/generated/prisma/models';

definePageMeta({
  layout: 'buvette',
  middleware: 'need-admin',
});

const toast = useToast();
const route = useRoute();

const { data: menuCategories } = await useFetch<MenuCategoryModel[]>('/api/buvette/categories');

const { data: menuItem } = await useFetch<MenuItemModel>(`/api/buvette/menu-items/${route.params.id}`);
const menuItemState = reactive<Partial<MenuItemModel>>(menuItem.value ?? {});

function formSubmit() {
  useApi(
    '/api/buvette/menu-items/update',
    {
      fetchOptions: {
        method: 'POST',
        body: menuItemState,
      },
      successString: 'Item updated !',
      onSuccess: () => navigateTo('/buvette'),
    }
  );
}
</script>

<template>
  <UForm @submit="formSubmit()">

    <UFormField label="Name" name="name">
      <UInput v-model="menuItemState.name" class="w-80" />
    </UFormField>
    
    <UFormField label="Description" name="description">
      <UTextarea v-model="menuItemState.description" class="w-80" :rows="7" />
    </UFormField>

    <UFormField label="Price" name="price">
      <UInputNumber v-model="menuItemState.price" :format-options="{minimumFractionDigits: 0.5, style: 'decimal'}" :step="0.5" />
    </UFormField>

    <UFormField label="Is available" name="is-available">
      <USwitch v-model="menuItemState.isAvailable" />
    </UFormField>

    <UFormField label="Category" name="category">
      <USelect :items="menuCategories" value-key="id" label-key="name" v-model="menuItemState.categoryId" class="w-52" />
    </UFormField>

    <UButton type="submit" label="Update" class="mt-4" />

  </UForm>
</template>
