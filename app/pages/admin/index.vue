<script setup lang="ts">
useHead({
  title: "Admin",
});

definePageMeta({
  middleware: "need-admin",
});
</script>

<template>
  <div>
    <AdminFormSeparator title="Lan administration">
      <UCard class="w-fit">
        <template #header>Days of lan</template>
        <AdminFormDaysOfLan />
      </UCard>

      <UCard class="w-fit">
        <template #header>All animations</template>
        <AdminFormAllAnimationsLinks />
      </UCard>
    </AdminFormSeparator>

    <AdminFormSeparator title="Buvette administration">
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
    </AdminFormSeparator>

    <AdminFormSeparator title="Users administration">
      <UCard class="w-fit">
        <template #header>Admin users</template>
        <AdminFormSwitchAdminUsers />
      </UCard>
    </AdminFormSeparator>

    <AdminFormSeparator title="Texts administration">
      <span>Nothing to see here, for now...</span>
    </AdminFormSeparator>
  </div>
</template>
