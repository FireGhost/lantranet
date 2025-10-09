<script setup lang="ts">
import type { MenuCategoryModel, MenuItemModel } from '~~/prisma/generated/prisma/models';

definePageMeta({
  layout: 'buvette',
  middleware: 'need-admin',
});

const toast = useToast();

const { data: menuCategories } = await useFetch<MenuCategoryModel[]>('/api/buvette/categories');

const menuItemState = reactive<Partial<MenuItemModel>>({});

function formSubmit() {
  useApi(
    '/api/buvette/menu-items/add',
    {
      fetchOptions: {
        method: 'POST',
        body: menuItemState,
      },
      successString: 'Item created !',
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

    <UButton type="submit" label="Créer !" class="mt-4" />

  </UForm>
</template>
