<script setup lang="ts">
import type {
  AnimationGetPayload,
  AnimationUpdateManyMutationInput,
} from "~~/prisma/generated/prisma/models";

definePageMeta({
  layout: "animations",
});

const route = useRoute();
const toast = useToast();
const isAdmin = useIsAdmin();

const { data: animation, refresh: refreshAnimation } = await useFetch<
  AnimationGetPayload<{
    include: {
      adminUser: true;
      lanDay: true;
      players: { include: { player: true } };
      teams: { include: { players: { include: { player: true } } } };
    };
  }>
>(`/api/animations/${route.params.id}`, {
  query: {
    withAdminUser: true,
    withLanDay: true,
    withPlayers: true,
    withTeams: true,
  },
});

useHead({
  title:
    animation.value?.shortName ??
    animation.value?.name ??
    $t("Animation not found"),
});

function deleteAnimation() {
  useApi(`/api/animations/${route.params.id}`, {
    fetchOptions: {
      method: "DELETE",
    },
    successString: $t("Animation removed"),
    onSuccess: () => {
      refreshNuxtData("animationsList");
      navigateTo("/animations");
    },
  });
}

function toggleSubscriptionOpen() {
  if (!animation.value) {
    toast.add({ title: $t("Animation not found") });
    return;
  }

  let successString = "";
  if (animation.value.openSubscription) {
    successString = $t("Subscriptions are now closed");
  } else {
    successString = $t("Subscriptions are now open !");
  }

  useApi(`/api/animations/${route.params.id}`, {
    fetchOptions: {
      method: "PUT",
      body: {
        openSubscription: !animation.value.openSubscription,
      } satisfies AnimationUpdateManyMutationInput,
    },
    successString: successString,
    onSuccess: () => refreshAnimation(),
  });
}
</script>

<template>
  <div>
    <template v-if="!animation">
      <UPageHero :title="$t('Animation not found')" />
    </template>

    <template v-else>
      <div v-if="isAdmin">
        <UButton :label="$t('Edit')" :to="`/animations/${animation.id}/edit`" />
        <UButton
          :label="$t('Toggle subscription')"
          class="ml-4"
          @click="toggleSubscriptionOpen()"
        />
        <USlideover :title="$t('Manage scores')">
          <UButton :label="$t('Manage scores')" class="ml-4" />

          <template #body>
            <FormAnimationScores
              :animation="animation"
              @player-score-updated="refreshAnimation()"
              @team-score-updated="refreshAnimation()"
            />
          </template>
        </USlideover>
        <USlideover v-if="animation.isTeamed" :title="$t('Manage teams')">
          <UButton :label="$t('Manage teams')" class="ml-4" />

          <template #body>
            <AdminAnimationTeamsManagement
              :animation="animation"
              @teams-updated="refreshAnimation()"
            />
          </template>
        </USlideover>
        <USlideover v-else :title="$t('Manage players')">
          <UButton :label="$t('Manage players')" class="ml-4" />

          <template #body>
            <AdminAnimationPlayersManagement
              :animation="animation"
              @animation-updated="refreshAnimation()"
            />
          </template>
        </USlideover>
        <UModal
          :title="$t('Are you sure')"
          :description="$t('Do you really want to delete this animation ?')"
        >
          <UButton
            :label="$t('Delete animation')"
            color="error"
            variant="outline"
            class="ml-16"
          />

          <template #body>
            <UButton
              :label="$t('Yes, delete')"
              color="error"
              class="ml-4"
              @click="deleteAnimation()"
            />
          </template>
        </UModal>
      </div>

      <AnimationHeader
        :animation="animation"
        @updated-teams="refreshAnimation()"
        @updated-player="refreshAnimation()"
      />

      <AnimationContentColumns :animation="animation" />
    </template>
  </div>
</template>
