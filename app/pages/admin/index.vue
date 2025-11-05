<script setup lang="ts">
useHead({
  title: $t('admin'),
});

definePageMeta({
  middleware: "need-admin",
});
</script>

<template>
  <div class="pb-4">
    <AdminFormSeparator :title="$t('lan')">
      <UCard class="w-fit">
        <template #header>{{ $t('days of lan') }}</template>
        <AdminFormDaysOfLan />
      </UCard>

      <UCard class="w-fit">
        <template #header>{{ $t("all animations") }}</template>
        <AdminFormAllAnimationsLinks />
      </UCard>
    </AdminFormSeparator>

    <AdminFormSeparator :title="$t('buvette')">
      <UCard class="w-fit">
        <template #header>{{ $t("menu categories") }}</template>
        <AdminFormMenuCategories />
      </UCard>

      <UCard class="w-fit">
        <template #header>{{ $t("menu items available") }}</template>
        <AdminFormMenuItems />
      </UCard>

      <UCard class="w-fit">
        <template #header>{{ $t("order status") }}</template>
        <AdminFormOrderStatus />
      </UCard>
    </AdminFormSeparator>

    <AdminFormSeparator :title="$t('users')">
      <UCard class="w-fit">
        <template #header>{{ $t("admin users") }}</template>
        <AdminFormSwitchAdminUsers />
      </UCard>

      <UCard class="w-fit">
        <template #header>{{ $t("reset password") }}</template>
        <AdminFormPasswordReset />
      </UCard>
    </AdminFormSeparator>

    <AdminFormSeparator :title="$t('texts')">
      <UCard class="w-fit">
        <template #header>{{ $t("homepage texts") }}</template>
        <AdminFormHomepageTexts />
      </UCard>

      <UCard class="w-fit">
        <template #header>{{ $t("app texts") }}</template>
        <AdminFormAppTexts />
      </UCard>
    </AdminFormSeparator>
  </div>
</template>
