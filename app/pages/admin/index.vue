<script setup lang="ts">
useHead({
  title: "Admin",
});

definePageMeta({
  middleware: "need-admin",
});
</script>

<template>
  <div class="flex mt-4 gap-4 flex-wrap">
    <UCard class="w-fit">
      <template #header>Days of lan</template>
      <AdminFormDaysOfLan />
    </UCard>

    <UCard class="w-fit">
      <template #header>All animations</template>
      <AdminFormAllAnimationsLinks />
    </UCard>

    <UCard class="w-fit">
      <template #header>Admin users</template>
      <AdminFormSwitchAdminUsers />
    </UCard>

    <UCard class="w-fit">
      <template #header>Menu Categories</template>
      <AdminFormMenuCategories />
    </UCard>

    <UCard class="w-fit">
      <template #header>Menu Items Available</template>
      <AdminFormMenuItems />
    </UCard>

    <UCard class="w-fit">
      <template #header>Order status</template>
      <AdminFormOrderStatus />
    </UCard>
  </div>
</template>
