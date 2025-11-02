<script setup lang="ts">
import { Role } from "~~/prisma/generated/prisma/enums";
import type { AnimationGetPayload } from "~~/prisma/generated/prisma/models";

const props = defineProps<{
  animation: AnimationGetPayload<{
    include: {
      lanDay: true;
      players: true;
    };
  }>,
}>();

defineEmits<{
  updatedTeams: [];
  updatedPlayer: [];
}>();

const { user } = useUserSession();
const isAdmin = user.value?.role === Role.ADMIN;

if (props.animation.id === undefined) {
  throw createError("Animation ID needed !");
}
</script>

<template>
  <UPageSection
    :ui="{ container: 'py-4 sm:py-6 lg:py-12' }"
    :headline="`${animation?.lanDay?.name ?? ''} ${animation?.startTime ?? ''}`"
    :title="animation?.name"
  >
    <template #links>
      <USlideover v-if="animation.isTeamed" title="Gestion d'équipes">
        <UButton v-if="animation.openSubscription || isAdmin" label="Gestion d'équipes" />

        <template #body>
          <FormAnimationTeams
            :animation="animation"
            @teams-updated="$emit('updatedTeams')"
          />
        </template>
      </USlideover>

      <FormAnimationPlayerSubscribeButton
        v-if="animation.isTeamed === false"
        :animation="animation"
        @player-subscription-updated="$emit('updatedPlayer')"
      />
    </template>

    <template #description>
      <p class="whitespace-pre-line">
        {{ animation.description }}
      </p>
    </template>
  </UPageSection>
</template>
