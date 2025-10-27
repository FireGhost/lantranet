<script setup lang="ts">
import { Role } from '~~/prisma/generated/prisma/enums';
import type { AnimationGetPayload, AnimationUpdateManyMutationInput } from '~~/prisma/generated/prisma/models';

definePageMeta({
  layout: 'animations',
});

const route = useRoute();
const { user } = useUserSession();

const isAdmin = user.value?.role === Role.ADMIN;

const { data: animation, refresh: refreshAnimation } = await useFetch<Partial<AnimationGetPayload<{
  include: {
    adminUser: true,
    lanDay: true,
    players: {include: {player: true}},
    teams: {include: {players: {include: {player: true}}}}
  }
}>>>(`/api/animations/${route.params.id}`, {
  query: {withAdminUser: true, withLanDay: true, withPlayers: true, withTeams: true},
  default: () => ref({}),
});

useHead({
  title: animation.value.shortName ?? animation.value.name,
});

function deleteAnimation() {
  useApi(
    `/api/animations/${route.params.id}`,
    {
      fetchOptions: {
        method: 'DELETE',
      },
      successString: 'Animation removed',
      onSuccess: () => {
        refreshNuxtData('animationsList');
        navigateTo('/animations');
      },
    }
  );
}

function toggleSubscriptionOpen() {
  let successString = '';
  if (animation.value.openSubscription) {
    successString = 'Subscriptions are now closed';
  }
  else {
    successString = 'Subscriptions are now open !';
  }
  
  useApi(
    `/api/animations/${route.params.id}`,
    {
      fetchOptions: {
        method: 'PUT',
        body: {
          openSubscription: !animation.value.openSubscription,
        } satisfies AnimationUpdateManyMutationInput
      },
      successString: successString,
      onSuccess: () => refreshAnimation(),
    }
  );
}
</script>

<template>
  <div>
    <div v-if="isAdmin">
      <UButton label="Edit" :to="`/animations/${animation?.id}/edit`" />
      <UButton label="Toggle subscription" class="ml-4" @click="toggleSubscriptionOpen()" />
      <USlideover title="Manage scores">
        <UButton label="Manage scores" class="ml-4" />

        <template #body>
          <FormAnimationScores :animation="animation" @player-score-updated="refreshAnimation()" @team-score-updated="refreshAnimation()" />
        </template>
      </USlideover>
      <UModal title="Are you sure" description="Do you really want to delete this animation ?" >
        <UButton label="Delete" color="error" variant="outline" class="ml-16" />

        <template #body>
          <UButton label="Yes, delete" color="error" variant="outline" class="ml-4" @click="deleteAnimation()"/>
        </template>
      </UModal>
    </div>

    <AnimationHeader :animation="animation" @updated-teams="refreshAnimation()" @updated-player="refreshAnimation()" />

    <AnimationContentColumns :animation="animation" />
  </div>
</template>