<script setup lang="ts">
import type { SelectItem } from "@nuxt/ui";
import type {
  MenuCategoryModel,
  MenuItemCreateInput,
  MenuItemModel,
  MenuItemUpdateInput,
} from "~~/prisma/generated/prisma/models";

const props = defineProps<{
  menuItem: Partial<MenuItemModel>;
}>();

const toast = useToast();

const menuItemState = ref(props.menuItem);

const { data: menuCategories } = await useFetch("/api/buvette/categories", {
  transform: (data: MenuCategoryModel[]): SelectItem[] =>
    data.map((menuCategory) => ({
      label: menuCategory.name,
      value: menuCategory.id,
    })),
});

const formSubmit = props.menuItem.id ? updateMenuItem : createMenuItem;
const submitButtonText = props.menuItem.id ? "Update" : "Create";

function createMenuItem() {
  if (!menuItemState.value.name) {
    toast.add({
      title: "Name cannot be empty",
      color: "error",
    });
    return;
  }

  useApi("/api/buvette/menu-items", {
    fetchOptions: {
      method: "POST",
      body: {
        category: {
          connect: {
            id: menuItemState.value.categoryId,
          },
        },
        name: menuItemState.value.name,
        description: menuItemState.value.description,
        isAvailable: menuItemState.value.isAvailable,
        price: menuItemState.value.price,
      } satisfies MenuItemCreateInput,
    },
    successString: "Item created !",
    onSuccess: () => navigateTo("/buvette"),
  });
}

function updateMenuItem() {
  useApi(`/api/buvette/menu-items/${props.menuItem.id}`, {
    fetchOptions: {
      method: "PUT",
      body: {
        category: {
          connect: {
            id: menuItemState.value.categoryId,
          },
        },
        name: menuItemState.value.name,
        description: menuItemState.value.description,
        isAvailable: menuItemState.value.isAvailable,
        price: menuItemState.value.price,
      } satisfies MenuItemUpdateInput,
    },
    successString: "Item updated !",
    onSuccess: () => navigateTo("/buvette"),
  });
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
      <UInputNumber
        v-model="menuItemState.price"
        :format-options="{ minimumFractionDigits: 0.5, style: 'decimal' }"
        :step="0.5"
      />
    </UFormField>

    <UFormField label="Is available">
      <USwitch v-model="menuItemState.isAvailable" />
    </UFormField>

    <UFormField label="Category">
      <USelect
        v-model="menuItemState.categoryId"
        :items="menuCategories"
        class="w-52"
      />
    </UFormField>

    <UButton type="submit" class="mt-4">{{ submitButtonText }}</UButton>
  </UForm>
</template>
