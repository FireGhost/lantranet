<template>
  <UPage>
    <template #left>
      <UNavigationMenu
        :items="[
          {
            label: $t('Order'),
            to: '/buvette',
          },
          {
            label: $t('My orders'),
            to: '/buvette/my-orders',
          },
        ]"
        orientation="vertical"
      />
    </template>

    <div class="mt-4 mb-8 mr-2">
      <slot />
    </div>
  </UPage>
</template>
