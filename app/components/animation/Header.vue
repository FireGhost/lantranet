<script setup lang="ts">
import type { AnimationGetPayload } from '~~/prisma/generated/prisma/models';

const props = defineProps<{
  animation: Partial<AnimationGetPayload<{include: {
    lanDay: true,
  }}>>
}>();

defineEmits<{
  (e: 'updatedTeams'): void,
  (e: 'updatedPlayer'): void,
}>();

if (props.animation.id === undefined) {
  throw createError('Animation ID needed !');
}
</script>

<template>
  <UPageSection
    :ui="{container: 'py-4 sm:py-6 lg:py-12'}"
    :headline="`${animation?.lanDay?.name ?? ''} ${animation?.startTime ?? ''}`"
    :title="animation?.name">

    <template v-if="animation.openSubscription" #links>
      <USlideover v-if="animation.isTeamed" title="Gestion d'équipes">
        <UButton label="Gestion d'équipes" />

        <template #body>
          <FormAnimationTeams :animation="animation" @teams-updated="$emit('updatedTeams')" />
        </template>
      </USlideover>

      <template v-else>
        <FormAnimationPlayerSubscribeButton :animation-id="props.animation.id" @player-subscription-updated="$emit('updatedPlayer')" />
      </template>
    </template>

    <template #description>
      <p style="white-space: pre-line;">
        {{ animation.description }}
      </p>
    </template>
  </UPageSection>
</template>