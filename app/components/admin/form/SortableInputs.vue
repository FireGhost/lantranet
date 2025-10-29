<script setup lang="ts" generic="T extends object, K extends keyof T">
import Sortable from "sortablejs";

defineProps<{
  items: T[];
  newItem: Partial<T>;
  idKey: K;
}>();

const emit = defineEmits<{
  orderUpdated: [keysSorted: Array<string>];
  updateItem: [item: T];
  deleteItem: [itemId: T[K]];
  addItem: [newItem: Partial<T>];
}>();

const sortableElementId = "sortable-" + useId();

onMounted(() => {
  const element = document.getElementById(sortableElementId);
  if (element) {
    const sortable = Sortable.create(element, {
      animation: 150,
      handle: ".sortable-handle",

      onEnd: () => {
        emit("orderUpdated", sortable.toArray());
      },
    });
  }
});
</script>

<template>
  <div :id="sortableElementId" class="flex flex-col">
    <UFieldGroup
      v-for="item in items"
      :key="item[idKey] as PropertyKey"
      :data-id="item[idKey]"
    >
      <UBadge
        color="neutral"
        variant="outline"
        icon="i-lucide-arrow-down-up"
        class="sortable-handle cursor-grab px-2"
      />

      <slot :item="item" />

      <UButton
        icon="i-lucide-save"
        size="sm"
        color="success"
        class="px-3"
        @click="$emit('updateItem', item)"
      />
      <UButton
        icon="i-lucide-trash-2"
        size="sm"
        color="error"
        variant="outline"
        @click="$emit('deleteItem', item[idKey])"
      />
    </UFieldGroup>
  </div>

  <UForm class="mt-4" @submit="$emit('addItem', newItem)">
    <UFormField name="name">
      <UFieldGroup>
        <slot :item="newItem" />
        <UButton label="Add" color="success" type="submit" />
      </UFieldGroup>
    </UFormField>
  </UForm>
</template>
