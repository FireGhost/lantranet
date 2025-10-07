<script setup lang="ts">
import type { MenuItemModel, MenuCategoryGetPayload } from '~~/prisma/generated/prisma/models';
import { Role } from '~~/prisma/generated/prisma/enums';

definePageMeta({
  layout: 'buvette',
});

const toast = useToast();
const { user } = useUserSession();

const isAdmin = computed(() => user.value?.role === Role.ADMIN);

const { data: menuCategories, refresh: refreshMenuCategories } = await useFetch<MenuCategoryGetPayload<{
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

const cartItems = ref<CartItem[]>([]);
const menuItemUserDescription = ref();

function deleteMenuItem(menuItemId: number) {
  $fetch('/api/buvette/menu-items/delete', {
    method: 'POST',
    body: {id: menuItemId},
  })
  .then((success) => {
    toast.add({title: 'Item removed with success'});
    refreshMenuCategories();
  }, (error) => {
    toast.add({
      title: 'Error while deleting menu item',
      description: error.data.message,
      color: 'error',
    });
  });
}

function addItemToCart(menuItem: MenuItemModel) {
  cartItems.value.push({
    menuItemId: menuItem.id,
    name: menuItem.name,
    price: menuItem.price,
    comment: menuItemUserDescription.value,
  });
  menuItemUserDescription.value = '';
}

function removeCartItem(itemIndex: number) {
  cartItems.value.splice(itemIndex, 1);
}

function sendOrder() {
  if (cartItems.value.length === 0) {
    toast.add({
      title: 'Ajoutez des produits avant, c\'est mieux',
      color: 'warning',
    });
    return;
  }

  $fetch('/api/buvette/orders/add', {
    method: 'POST',
    body: cartItems.value,
  })
  .then((success) => {
    toast.add({title: 'Commande envoyée'});
    cartItems.value = [];
  }, (error) => {
    toast.add({
      title: 'Error during order sending',
      description: error.data.message,
      color: 'error',
    })
  });
}
</script>

<template>
  <UPage>
    <UButton v-if="isAdmin" label="Add new entry" to="/buvette/menu-items/add" />

    <template v-for="menuCategory in menuCategoriesComputed" :key="menuCategory.id">
      <UPageHeader :title="menuCategory.name" />
      <UPageGrid>

        <UBlogPost v-for="menuItem in menuCategory.menuItems" :key="menuItem.id" :title="menuItem.name" :description="`CHF ${menuItem.price}`">
        <template #footer>

          <div class="mb-4 px-8">
            <UModal>
              <UButton label="Add" class="px-6" @click="menuItemUserDescription = ''" />

              <template #content="{ close }">
                <UPage class="p-4">
                  <UPageFeature :title="menuItem.name">
                    <template #description>
                      <span v-html="menuItem.description?.replaceAll('\n', '<br />')" />
                    </template>
                  </UPageFeature>
                  
                  <UForm class="mt-8">
                    <UFormField label="Commentaire">
                      <UTextarea placeholder="Indiquez nous ce que vous voulez..." :rows="6" class="w-full" v-model="menuItemUserDescription" />
                    </UFormField>
                    <UButton label="Ajouter au panier" type="submit" class="mt-2" @click="addItemToCart(menuItem); close()" />
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
      </UBlogPost>

      </UPageGrid>
    </template>

    <template #right>
      <div>
        <UPageFeature title="My cart" class="mb-2" />
        <UUser v-for="(cartItem, index) in cartItems" :key="index" :name="cartItem.name" class="mt-1">
          <template #avatar>
            <UButton label="X" variant="outline" color="error" size="xs" @click="removeCartItem(index)" />
          </template>
        </UUser>

        <UButton label="Envoyer la commande" class="mt-6" @click="sendOrder()" />
      </div>
    </template>
  </UPage>
</template>
