<script setup lang="ts">
import { Role } from '~~/prisma/generated/prisma/enums';
import type { MenuItemModel, OrdersItemsCreateManyOrderInput } from '~~/prisma/generated/prisma/models';

defineProps<{
  menuItem: MenuItemModel
}>();

const emit = defineEmits<{
  (e: 'addToCart', orderItem: OrdersItemsCreateManyOrderInput): void,
  (e: 'menuItemsUpdated'): void,
}>();

const { user } = useUserSession();

const isAdmin = user.value?.role === Role.ADMIN;

const orderComment = ref('');

function deleteMenuItem(menuItemId: number) {
  useApi(
    '/api/buvette/menu-items/delete',
    {
      fetchOptions: {
        method: 'POST',
        body: {id: menuItemId},
      },
      successString: 'Item removed with success',
      onSuccess: () => emit('menuItemsUpdated'),
    }
  );
}

function addToCart(menuItem: MenuItemModel) {
  emit('addToCart', {
    comment: orderComment.value,
    itemId: menuItem.id,
    nameAtOrder: menuItem.name,
    priceAtOrder: menuItem.price,
  });
  orderComment.value = '';
}
</script>

<template>
  <div class="mb-4 px-8">
    <UModal>
      <UButton label="Add" class="px-6" @click="orderComment = ''" />

      <template #content="{ close }">
        <UPage class="p-4">
          <UPageFeature :title="menuItem.name">
            <template #description>
              <span v-html="menuItem.description?.replaceAll('\n', '<br />')" />
            </template>
          </UPageFeature>
          
          <UForm class="mt-8">
            <UFormField label="Commentaire">
              <UTextarea placeholder="Indiquez nous ce que vous voulez..." :rows="6" class="w-full" v-model="orderComment" />
            </UFormField>
            <UButton label="Ajouter au panier" type="submit" class="mt-2" @click="addToCart(menuItem); close()" />
          </UForm>
        </UPage>
      </template>
    </UModal>

    <template v-if="isAdmin">
      <UButton label="Edit" variant="soft" color="warning" class="ml-4" :to="`/buvette/menu-items/${menuItem.id}/edit`" />
      <UModal title="Vous êtes sûr ?">
        <UButton label="Delete" variant="outline" color="error" class="ml-4" />

        <template #body>
          <UButton label="Oui, supprime ça !" color="error" @click="deleteMenuItem(menuItem.id)" />
        </template>
      </UModal>
    </template>
  </div>
</template>