<script setup lang="ts">
import type { OrdersItemsCreateManyOrderInput } from '~~/prisma/generated/prisma/models';

definePageMeta({
  layout: 'buvette',
});

const toast = useToast();

const cartItems = ref<OrdersItemsCreateManyOrderInput[]>([]);

function sendOrder() {
  if (cartItems.value.length === 0) {
    toast.add({
      title: 'Ajoutez des produits avant, c\'est mieux',
      color: 'warning',
    });
    return;
  }

  useApi(
    '/api/buvette/orders/add',
    {
      fetchOptions: {
        method: 'POST',
        body: cartItems.value,
      },
      successString: 'Commande envoyée',
      onSuccess: () => {cartItems.value = []}
    }
  );
}
</script>

<template>
  <UPage>
    <BuvetteMenuItemsList @add-to-cart="(orderItem) => cartItems.push(orderItem)" />

    <template #right>
      <div>
        <UPageFeature title="My cart" class="mb-2" />
        <UUser v-for="(cartItem, index) in cartItems" :key="index" :name="cartItem.nameAtOrder" class="mt-1">
          <template #avatar>
            <UButton label="X" variant="outline" color="error" size="xs" @click="cartItems.splice(index, 1)" />
          </template>
        </UUser>

        <UButton label="Envoyer la commande" class="mt-6" @click="sendOrder()" />
      </div>
    </template>
  </UPage>
</template>