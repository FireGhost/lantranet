<script setup lang="ts">
useHead({
  title: $t('Admin'),
});

definePageMeta({
  middleware: "need-admin",
});
</script>

<template>
  <div class="pb-4">
    <AdminFormSeparator :title="$t('Lan')">
      <UCard class="w-fit">
        <template #header>{{ $t('Days of lan') }}</template>
        <AdminFormDaysOfLan />
      </UCard>

      <UCard class="w-fit">
        <template #header>{{ $t("All animations") }}</template>
        <AdminFormAllAnimationsLinks />
      </UCard>
    </AdminFormSeparator>

    <AdminFormSeparator :title="$t('Buvette')">
      <UCard class="w-fit">
        <template #header>{{ $t("Menu categories") }}</template>
        <AdminFormMenuCategories />
      </UCard>

      <UCard class="w-fit">
        <template #header>{{ $t("Menu items available") }}</template>
        <AdminFormMenuItems />
      </UCard>

      <UCard class="w-fit">
        <template #header>{{ $t("Order status") }}</template>
        <AdminFormOrderStatus />
      </UCard>
    </AdminFormSeparator>

    <AdminFormSeparator :title="$t('Users')">
      <UCard class="w-fit">
        <template #header>{{ $t("Admin users") }}</template>
        <AdminFormSwitchAdminUsers />
      </UCard>

      <UCard class="w-fit">
        <template #header>{{ $t("Reset password") }}</template>
        <AdminFormPasswordReset />
      </UCard>
    </AdminFormSeparator>

    <AdminFormSeparator :title="$t('Texts')">
      <UCard class="w-fit">
        <template #header>{{ $t("Homepage texts") }}</template>
        <AdminFormHomepageTexts />
      </UCard>

      <UCard class="w-fit">
        <template #header>{{ $t("App texts") }}</template>
        <AdminFormAppTexts />
      </UCard>

      <UCard class="w-fit">
        <template #header>{{ $t("App locale") }}</template>
        <AdminFormAppLocale />
      </UCard>
    </AdminFormSeparator>
  </div>
</template>
