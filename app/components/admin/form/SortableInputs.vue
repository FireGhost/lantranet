<script setup lang="ts">
import Sortable from 'sortablejs';

type T = any;

defineProps<{
  items: T[],
  newItem: T,
  idKey: string,
}>();

const emit = defineEmits<{
  orderUpdated: [keysSorted: string[]],
  updateItem: [item: T],
  deleteItem: [itemId: string],
  addItem: [newItem: T],
}>();

const sortableElementId = 'sortable-' + useId();

onMounted(() => {
  const element = document.getElementById(sortableElementId);
  if (element) {
    const sortable = Sortable.create(element, {
      animation: 150,
      handle: '.sortable-handle',

      onEnd: () => {
        emit('orderUpdated', sortable.toArray());
      },
    });
  }
});
</script>

<template>
  <div class="flex flex-col" :id="sortableElementId">
    <UFieldGroup v-for="item in items" :key="item[idKey]" :data-id="item[idKey]">
      <UBadge color="neutral" variant="outline" icon="i-lucide-arrow-down-up" class="sortable-handle cursor-grab px-2" />

      <slot :item="item" />

      <UButton icon="i-lucide-save" color="success" @click="$emit('updateItem', item)" class="cursor-pointer px-2" />
      <UButton icon="i-lucide-trash-2" color="error" variant="outline" @click="$emit('deleteItem', item[idKey])" style="cursor: pointer;" />
    </UFieldGroup>
  </div>

  <UForm @submit="$emit('addItem', newItem)" class="mt-4">
    <UFormField name="name">
      <UFieldGroup>
        <slot :item="newItem" />
        <UButton label="Add" color="success" type="submit" />
      </UFieldGroup>
    </UFormField>
  </UForm>
</template>