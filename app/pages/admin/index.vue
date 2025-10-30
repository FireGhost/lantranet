<script setup lang="ts">
useHead({
  title: "Admin",
});

definePageMeta({
  middleware: "need-admin",
});
</script>

<template>
  <div class="pb-4">
    <AdminFormSeparator title="Lan">
      <UCard class="w-fit">
        <template #header>Days of lan</template>
        <AdminFormDaysOfLan />
      </UCard>

      <UCard class="w-fit">
        <template #header>All animations</template>
        <AdminFormAllAnimationsLinks />
      </UCard>
    </AdminFormSeparator>

    <AdminFormSeparator title="Buvette">
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

    <AdminFormSeparator title="Users">
      <UCard class="w-fit">
        <template #header>Admin users</template>
        <AdminFormSwitchAdminUsers />
      </UCard>
    </AdminFormSeparator>

    <AdminFormSeparator title="Texts">
      <UCard class="w-fit">
        <template #header>Homepage texts</template>
        <AdminFormHomepageTexts />
      </UCard>

      <UCard class="w-fit">
        <template #header>App texts</template>
        <AdminFormAppTexts />
      </UCard>
    </AdminFormSeparator>
  </div>
</template>
