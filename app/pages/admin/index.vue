<script setup lang="ts">
import { Role } from '~~/prisma/generated/prisma/enums';
import type { UserModel, AnimationModel, LanDayModel, MenuCategoryModel, MenuItemModel, OrderStatusModel } from '~~/prisma/generated/prisma/models';

definePageMeta({
  middleware: "need-admin",
});

const toast = useToast();

const { data: lanDays, refresh: refreshLanDays } = await useFetch<LanDayModel[]>('/api/lan-days');
const lanDaysSorted = computed(() => lanDays.value?.toSorted((a, b) => a.weight - b.weight));

const { data: animations } = await useFetch<AnimationModel[]>('/api/animations');

const { data: users } = await useFetch<UserModel[]>('/api/users');

const { data: menuCategories, refresh: refreshMenuCategories } = await useFetch<MenuCategoryModel[]>('/api/buvette/categories');

const { data: menuItems } = await useFetch<MenuItemModel[]>('/api/buvette/menu-items');

const { data: orderStatuses, refresh: refreshOrderStatus } = await useFetch<OrderStatusModel[]>('/api/buvette/status');
const orderStatusesSorted = computed(() => {
  return orderStatuses.value?.sort((a, b) => a.weight - b.weight);
});

const newLanDay = reactive<Partial<LanDayModel>>({});
function addLanDay() {
  $fetch('/api/lan-days/add', {
    method: 'POST',
    body: newLanDay,
  })
  .then((success) => {
    toast.add({title: 'New day added'});
    newLanDay.name = '';
    refreshLanDays();
  }, (error) => {
    toast.add({
      title: 'Error while adding new day',
      description: error.data.message,
      color: 'error',
    })
  });
}

function deleteLanDay(lanDay: LanDayModel) {
  $fetch('/api/lan-days/delete', {
    method: 'POST',
    body: lanDay
  })
  .then((success) => {
    toast.add({title: 'Day removed'});
    refreshLanDays();
  }, (error) => {
    toast.add({
      title: 'Error while removing day',
      description: error.data.message,
      color: 'error',
    })
  });
}

function updateLanDay(lanDay: LanDayModel, operation: 'up' | 'down' | 'edit') {
  switch(operation) {
    case 'up':
      lanDay.weight--;
      break;

    case 'down':
      lanDay.weight++;
      break;
  }

  $fetch('/api/lan-days/update', {
    method: 'POST',
    body: lanDay
  })
  .then((success) => {
    toast.add({title: 'Day updated'});
    refreshLanDays();
  }, (error) => {
    toast.add({
      title: 'Error while updating day',
      description: error.data.message,
      color: 'error',
    })
  });
}

function onAdminChange(userId: number) {
  $fetch(`/api/users/${userId}/toggle-admin`, {
    method: 'POST',
  })
  .then((success) => {
    toast.add({title: 'User updated'});
  }, (error) => {
    toast.add({
      title: 'Error while updating the user',
      description: error.data.message,
      color: 'error',
    });
  });
}

function updateMenuCategory(menuCategory: MenuCategoryModel) {
  $fetch('/api/buvette/categories/update', {
    method: 'POST',
    body: menuCategory,
  })
  .then((success) => {
    toast.add({title: 'Category updated'});
    refreshMenuCategories();
  }, (error) => {
    toast.add({
      title: 'Error while updating menu category',
      description: error.data.message,
      color: 'error',
    });
  });
}

function deleteMenuCategory(menuCategoryId: number) {
  $fetch('/api/buvette/categories/delete', {
    method: 'POST',
    body: {id: menuCategoryId},
  })
  .then((success) => {
    toast.add({title: 'Category updated'});
    refreshMenuCategories();
  }, (error) => {
    toast.add({
      title: 'Error while updating menu category',
      description: error.data.message,
      color: 'error',
    });
  });
}

const newMenuCategory = reactive<Partial<MenuCategoryModel>>({});
function createMenuCategory() {
  $fetch('/api/buvette/categories/add', {
    method: 'POST',
    body: newMenuCategory,
  })
  .then((success) => {
    toast.add({title: 'Category created'});
    refreshMenuCategories();
    newMenuCategory.name = '';
  }, (error) => {
    toast.add({
      title: 'Error while creating new menu category',
      description: error.data.message,
      color: 'error',
    });
  });
}

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

  $fetch('/api/buvette/menu-items/update', {
    method: 'POST',
    body: menuItemUpdated,
  })
  .then((success) => {
    toast.add({title: 'Menu item updated'});
  }, (error) => {
    toast.add({
      title: 'Error while updating menu item',
      description: error.data.message,
      color: 'error',
    });
  });
}

const newOrderStatus = reactive<Partial<OrderStatusModel>>({});
function createOrderStatus() {
  $fetch('/api/buvette/status/add', {
    method: 'POST',
    body: newOrderStatus,
  })
  .then((success) => {
    toast.add({title: 'Status created'});
    refreshOrderStatus();
    newOrderStatus.name = '';
    newOrderStatus.weight = undefined;
    newOrderStatus.color = '';
  }, (error) => {
    toast.add({
      title: 'Error while creating status',
      description: error.data.message,
      color: 'error',
    });
  });
}

function updateOrderStatus(orderStatus: OrderStatusModel) {
  $fetch('/api/buvette/status/update', {
    method: 'POST',
    body: orderStatus,
  })
  .then((success) => {
    toast.add({title: 'Status updated'});
    refreshOrderStatus();
  }, (error) => {
    toast.add({
      title: 'Error while updating status',
      description: error.data.message,
      color: 'error',
    });
  });
}

function deleteOrderStatus(orderStatusId: number) {
  $fetch('/api/buvette/status/delete', {
    method: 'POST',
    body: {id: orderStatusId},
  })
  .then((success) => {
    toast.add({title: 'Status deleted'});
    refreshOrderStatus();
  }, (error) => {
    toast.add({
      title: 'Error while deleting status',
      description: error.data.message,
      color: 'error',
    });
  });
}
</script>

<template>
  <div class="flex mt-4 gap-4 flex-wrap">

    <UCard class="w-fit">
      <template #header>
        Days of lan
      </template>
      
      <div class="flex flex-col">
        <UFieldGroup v-for="lanDay in lanDaysSorted" :key="lanDay.id">
          <UButton label="Up" color="info" @click="updateLanDay(lanDay, 'up')" />
          <UButton label="Down" color="info" @click="updateLanDay(lanDay, 'down')" />
          <UInput :value="lanDay.name" />
          <UButton label="Update" color="success" @click="updateLanDay(lanDay, 'edit')" />
          <UButton label="Del" color="error" @click="deleteLanDay(lanDay)" />
        </UFieldGroup>
      </div>

      <template #footer>
        <UForm @submit="addLanDay()">
          <UFormField name="name">
            <UFieldGroup>
              <UInput placeholder="Enter day" v-model="newLanDay.name" />
              <UButton label="Add" color="success" type="submit" />
            </UFieldGroup>
          </UFormField>
        </UForm>
      </template>
    </UCard>

    <UCard class="w-fit">
      <template #header>
        All animations
      </template>

      <ULink v-for="animation in animations" :key="animation.id" :to="`/animations/${animation.id}`" class="block">
        {{ animation.name }}
      </ULink>
    </UCard>
    
    <UCard class="w-fit">
      <template #header>
        Admin users
      </template>

      <div v-for="user in users" :key="user.id">
        <UFieldGroup>
          <UBadge color="neutral" variant="outline" size="lg" :label="user.username" />
          <UBadge color="neutral" variant="outline">
            <USwitch @change="onAdminChange(user.id)" :defaultValue="user.role === Role.ADMIN" />
          </UBadge>
        </UFieldGroup>
      </div>
    </UCard>
    
    <UCard class="w-fit">
      <template #header>
        Menu Categories
      </template>

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
    </UCard>

    <UCard class="w-fit">
      <template #header>
        Menu Items Available
      </template>

      <div v-for="menuItem in menuItems" :key="menuItem.id">
        <UFieldGroup>
          <UBadge color="neutral" variant="outline" size="lg" :label="menuItem.name" />
          <UBadge color="neutral" variant="outline">
            <USwitch @change="onMenuItemChange(menuItem.id)" :defaultValue="menuItem.isAvailable" />
          </UBadge>
        </UFieldGroup>
      </div>
    </UCard>

    <UCard class="w-fit">
      <template #header>
        Order status
      </template>

      <div v-for="orderStatus in orderStatusesSorted" :key="orderStatus.id">
        <UFieldGroup>
          <UInput v-model="orderStatus.weight" type="number" class="w-20" />
          <UInput v-model="orderStatus.name" />
          <UInput v-model="orderStatus.color" />
          <UButton label="Update" color="success" @click="updateOrderStatus(orderStatus)" />
          <UButton label="Delete" color="error" variant="outline" @click="deleteOrderStatus(orderStatus.id)" />
        </UFieldGroup>
      </div>

      <UForm @submit="createOrderStatus()">
        <UFieldGroup class="mt-4">
          <UInput placeholder="Weight" type="number" v-model="newOrderStatus.weight" class="w-20" />
          <UInput placeholder="Status name" v-model="newOrderStatus.name" />
          <UInput placeholder="Color name" v-model="newOrderStatus.color" />
          <UButton label="Add" color="success" type="submit" />
        </UFieldGroup>
      </UForm>
    </UCard>

  </div>
</template>
