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
  useApi(
    '/api/lan-days/add',
    {
      fetchOptions: {
        method: 'POST',
        body: newLanDay,
      },
      successString: 'New day added',
      onSuccess: () => {
        newLanDay.name = '';
        refreshLanDays();
      },
    }
  )
}

function deleteLanDay(lanDay: LanDayModel) {
  useApi(
    '/api/lan-days/delete',
    {
      fetchOptions: {
        method: 'POST',
        body: lanDay,
      },
      successString: 'Day removed',
      onSuccess: refreshLanDays,
    }
  );
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

  useApi(
    '/api/lan-days/update',
    {
      fetchOptions: {
        method: 'POST',
        body: lanDay
      },
      successString: 'Day updated',
      onSuccess: refreshLanDays,
    }
  );
}

function onAdminChange(userId: number) {
  useApi(
    `/api/users/${userId}/toggle-admin`,
    {
      fetchOptions: {
        method: 'POST',
      },
      successString: 'User updated',
    }
  );
}

function updateMenuCategory(menuCategory: MenuCategoryModel) {
  useApi(
    '/api/buvette/categories/update',
    {
      fetchOptions: {
        method: 'POST',
        body: menuCategory,
      },
      successString: 'Category updated',
      onSuccess: refreshMenuCategories,
    }
  );
}

function deleteMenuCategory(menuCategoryId: number) {
  useApi(
    '/api/buvette/categories/delete',
    {
      fetchOptions: {
        method: 'POST',
        body: {id: menuCategoryId},
      },
      successString: 'Category updated',
      onSuccess: refreshMenuCategories,
    }
  );
}

const newMenuCategory = reactive<Partial<MenuCategoryModel>>({});
function createMenuCategory() {
  useApi(
    '/api/buvette/categories/add',
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

  useApi(
    '/api/buvette/menu-items/update',
    {
      fetchOptions: {
        method: 'POST',
        body: menuItemUpdated,
      },
      successString: 'Menu item updated',
    }
  );
}

const newOrderStatus = reactive<Partial<OrderStatusModel>>({});
function createOrderStatus() {

  useApi(
    '/api/buvette/status/add',
    {
      fetchOptions: {
        method: 'POST',
        body: newOrderStatus,
      },
      successString: 'Status created',
      onSuccess: () => {
        newOrderStatus.name = '';
        newOrderStatus.weight = undefined;
        newOrderStatus.color = '';
      },
    }
  );
}

function updateOrderStatus(orderStatus: OrderStatusModel) {
  useApi(
    '/api/buvette/status/update',
    {
      fetchOptions: {
        method: 'POST',
        body: orderStatus,
      },
      successString: 'Status updated',
      onSuccess: refreshOrderStatus,
    }
  );
}

function deleteOrderStatus(orderStatusId: number) {
  useApi(
    '/api/buvette/status/delete',
    {
      fetchOptions: {
        method: 'POST',
        body: {id: orderStatusId},
      },
      successString: 'Status deleted',
      onSuccess: refreshOrderStatus,
    }
  );
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
