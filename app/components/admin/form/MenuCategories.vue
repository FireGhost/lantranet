<script setup lang="ts">
import type {
  MenuCategoryCreateInput,
  MenuCategoryModel,
  MenuCategoryUpdateInput,
} from "~~/prisma/generated/prisma/models";

const toast = useToast();

const { data: menuCategories, refresh: refreshMenuCategories } = await useFetch<
  MenuCategoryModel[]
>("/api/buvette/categories", {
  query: { orderByWeight: true },
});

const newMenuCategory = reactive<Partial<MenuCategoryModel>>({});

function createMenuCategory(newMenuCategory: Partial<MenuCategoryModel>) {
  if (!newMenuCategory.name) {
    toast.add({
      title: 'Please enter a category name',
      color: 'error',
    });
    return;
  }

  useApi("/api/buvette/categories", {
    fetchOptions: {
      method: "POST",
      body: {
        name: newMenuCategory.name,
        weight: menuCategories.value?.length ?? 0,
      } satisfies MenuCategoryCreateInput,
    },
    successString: "Category created",
    onSuccess: () => {
      newMenuCategory.name = "";
      refreshMenuCategories();
    },
  });
}

function updateMenuCategory(menuCategory: MenuCategoryModel) {
  useApi(`/api/buvette/categories/${menuCategory.id}`, {
    fetchOptions: {
      method: "PUT",
      body: {
        name: menuCategory.name,
      } satisfies MenuCategoryUpdateInput,
    },
    successString: "Category updated with success",
    onSuccess: () => refreshMenuCategories(),
  });
}

function deleteMenuCategory(menuCategoryId: number) {
  useApi(`/api/buvette/categories/${menuCategoryId}`, {
    fetchOptions: {
      method: "DELETE",
    },
    successString: "Category deleted",
    onSuccess: () => refreshMenuCategories(),
  });
}

function updateOrderMenuCategories(newKeysOrder: string[]) {
  const promises = [];
  for (const weight in newKeysOrder) {
    promises.push(
      useApi(`/api/buvette/categories/${newKeysOrder[weight]}`, {
        fetchOptions: {
          method: "PUT",
          body: {
            weight: Number(weight),
          } satisfies MenuCategoryUpdateInput,
        },
      }),
    );
  }
  Promise.all(promises).then(() => {
    toast.add({
      title: "Order saved",
    });
    refreshMenuCategories();
  });
}
</script>

<template>
  <AdminFormSortableInputs
    v-slot="{ item }"
    :items="menuCategories ?? []"
    id-key="id"
    :new-item="newMenuCategory"
    @add-item="createMenuCategory"
    @update-item="updateMenuCategory"
    @delete-item="deleteMenuCategory"
    @order-updated="updateOrderMenuCategories"
  >
    <UInput v-model="item.name" placeholder="Category name" />
  </AdminFormSortableInputs>
</template>
