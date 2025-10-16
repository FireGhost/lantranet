<script setup lang="ts">
definePageMeta({
  layout: 'buvette',
  middleware: 'need-admin',
});
</script>

<template>
  <FormMenuItem :menu-item="{}" />
</template>
