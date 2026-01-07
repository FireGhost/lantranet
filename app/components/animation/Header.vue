<script setup lang="ts">
import type { AnimationGetPayload } from "~~/prisma/generated/prisma/models";

defineProps<{
  animation: AnimationGetPayload<{
    include: {
      lanDay: true;
      players: true;
      teams: {
        include: {
          players: true;
        };
      };
    };
  }>;
}>();

defineEmits<{
  updatedTeams: [];
  updatedPlayer: [];
}>();
</script>

<template>
  <UPageSection
    :ui="{ container: 'py-4 sm:py-6 lg:py-12' }"
    :headline="`${animation.lanDay?.name ?? ''} ${animation.startTime ?? ''}`"
    :title="animation.name"
  >
    <template #links>
      <template v-if="animation.openSubscription">
        <USlideover v-if="animation.isTeamed" :title="$t('Team management')">
          <UButton :label="$t('Team management')" />

          <template #body>
            <FormAnimationTeams
              :animation="animation"
              @teams-updated="$emit('updatedTeams')"
            />
          </template>
        </USlideover>

        <FormAnimationPlayerSubscribeButton
          v-if="!animation.isTeamed"
          :animation="animation"
          @player-subscription-updated="$emit('updatedPlayer')"
        />
      </template>
      <template v-else>
        <UBadge
          color="error"
          variant="outline"
          :label="$t('Subscription closed')"
        />
      </template>
    </template>

    <template #description>
      <p class="whitespace-pre-line">
        {{ animation.description }}
      </p>
    </template>
  </UPageSection>
</template>
