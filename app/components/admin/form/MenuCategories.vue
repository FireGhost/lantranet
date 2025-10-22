<script setup lang="ts">
import type { MenuCategoryCreateInput, MenuCategoryModel, MenuCategoryUpdateInput } from '~~/prisma/generated/prisma/models';

const { data: menuCategories, refresh: refreshMenuCategories } = await useFetch<MenuCategoryModel[]>('/api/buvette/categories');

function updateMenuCategory(menuCategory: MenuCategoryModel) {
  useApi(
    `/api/buvette/categories/${menuCategory.id}`,
    {
      fetchOptions: {
        method: 'PUT',
        body: {
          name: menuCategory.name,
        } satisfies MenuCategoryUpdateInput,
      },
      successString: 'Category updated',
      onSuccess: refreshMenuCategories,
    }
  );
}

function deleteMenuCategory(menuCategoryId: number) {
  useApi(
    `/api/buvette/categories/${menuCategoryId}`,
    {
      fetchOptions: {
        method: 'DELETE',
      },
      successString: 'Category deleted',
      onSuccess: refreshMenuCategories,
    }
  );
}

const newMenuCategory = reactive<Partial<MenuCategoryCreateInput>>({});
function createMenuCategory() {
  useApi(
    '/api/buvette/categories',
    {
      fetchOptions: {
        method: 'POST',
        body: newMenuCategory,
      },
      successString: 'Category created',
      onSuccess: () => {
        refreshMenuCategories();
        newMenuCategory.name = '';
      }
    }
  );
}
</script>

<template>
  <div class="flex flex-col">
    <UFieldGroup v-for="menuCategory in menuCategories" :key="menuCategory.id">
      <UInput v-model="menuCategory.name" />
      <UButton label="Update" color="success" @click="updateMenuCategory(menuCategory)" />
      <UButton label="Delete" color="error" variant="outline" @click="deleteMenuCategory(menuCategory.id)" />
    </UFieldGroup>

    <UForm @submit="createMenuCategory()">
      <UFieldGroup class="mt-4">
        <UInput placeholder="Enter category" v-model="newMenuCategory.name" />
        <UButton label="Add" color="success" type="submit" />
      </UFieldGroup>
    </UForm>
  </div>
</template>