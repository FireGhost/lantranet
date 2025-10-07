<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui';
import type { TeamModel, TeamCreateInput, AnimationGetPayload } from '~~/prisma/generated/prisma/models';

definePageMeta({
  layout: 'animations',
});

const route = useRoute();
const toast = useToast();

const { data: myTeam, refresh: refreshMyTeam } = await useFetch<Partial<TeamModel>>(`/api/animations/${route.params.id}/teams/my-team`);
const newTeam = ref<Partial<TeamCreateInput>>({});

const { data: isAdmin } = await useFetch('/api/users/is-admin');

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

const subscribeButton: Ref<ButtonProps> = ref({
  label: 'loading...',
});
async function updateSubscribeButton() {
  if (animation.value.isTeamed) {
      subscribeButton.value.label = 'Gestion d\'équipes';
      subscribeButton.value.color = 'primary';
      subscribeButton.value.onClick = undefined;
  }
  else {
    const isSoloSubscribed = await $fetch(`/api/animations/${route.params.id}/subscribed`);
    if (isSoloSubscribed) {
      subscribeButton.value.label = 'Je me retire';
      subscribeButton.value.color = 'error';
      subscribeButton.value.onClick = unsubscribeSolo;
    }
    else {
      subscribeButton.value.label = 'Inscris moi !';
      subscribeButton.value.color = 'primary';
      subscribeButton.value.onClick = subscribeSolo;
    }
  }
}
await updateSubscribeButton();

function unsubscribeSolo() {
  const subscribeBody: SubscribePost = {
    subscribe: false
  }
  $fetch(`/api/animations/${route.params.id}/subscribe`, {
    method: 'POST',
    body: subscribeBody,
  })
  .then((success) => {
    toast.add({title: 'Your have been removed'});
    updateSubscribeButton();
    refreshAnimation();
  }, (error) => {
    toast.add({
      title: 'Error while unsubscribing to this animation',
      description: error.data.message,
      color: 'error',
    });
  });
}

function subscribeSolo() {
  const subscribeBody: SubscribePost = {
    subscribe: true
  }
  $fetch(`/api/animations/${route.params.id}/subscribe`, {
    method: 'POST',
    body: subscribeBody,
  })
  .then((success) => {
    toast.add({title: 'Subscribed !'});
    updateSubscribeButton();
    refreshAnimation();
  }, (error) => {
    toast.add({
      title: 'Error while subscribing to this animation',
      description: error.data.message,
      color: 'error',
    });
  });
}

function deleteAnimation() {
  $fetch('/api/animations/delete', {
    method: 'POST',
    body: animation.value
  })
  .then((success) => {
    toast.add({title: 'Animation removed'});
    navigateTo('/animations');
  }, (error) => {
    toast.add({
      title: 'Error while removing the animation',
      description: error.data.message,
      color: 'error',
    });
  });
}

function createNewTeam() {
  $fetch(`/api/animations/${route.params.id}/teams/add`, {
    method: 'POST',
    body: newTeam.value,
  })
  .then((success) => {
    toast.add({title: 'New team created !'});
    refreshMyTeam();
    refreshAnimation();
  }, (error) => {
    toast.add({
      title: 'Error while creating the team',
      description: error.data.message,
      color: 'error',
    });
  });
}

function leaveTeam() {
  const subscribeBody: SubscribePost = {
    subscribe: false,
  };
  $fetch(`/api/animations/${route.params.id}/teams/${myTeam.value?.id}/subscribe`, {
    method: 'POST',
    body: subscribeBody,
  })
  .then((success) => {
    toast.add({title: 'You left the team'});
    refreshMyTeam();
    refreshAnimation();
  }, (error) => {
    toast.add({
      title: 'Error while leaving the team',
      description: error.data.message,
      color: 'error',
    });
  });
}

function joinTeam(teamId: number) {
  const subscribeBody: SubscribePost = {
    subscribe: true,
  };
  $fetch(`/api/animations/${route.params.id}/teams/${teamId}/subscribe`, {
    method: 'POST',
    body: subscribeBody,
  })
  .then((success) => {
    toast.add({title: 'You joined a team'});
    refreshMyTeam();
    refreshAnimation();
  }, (error) => {
    toast.add({
      title: 'Error while joining the team',
      description: error.data.message,
      color: 'error',
    });
  });
}

function deleteMyTeam() {
  $fetch(`/api/animations/${route.params.id}/teams/${myTeam.value?.id}/delete`, {
    method: 'POST',
  })
  .then((success) => {
    toast.add({title: 'You deleted the team'});
    refreshMyTeam();
    refreshAnimation();
  }, (error) => {
    toast.add({
      title: 'Error while deleting the team',
      description: error.data.message,
      color: 'error',
    });
  });
}

function updateMyTeamName() {
  $fetch(`/api/animations/${route.params.id}/teams/${myTeam.value?.id}/update`, {
    method: 'POST',
    body: myTeam.value,
  })
  .then((success) => {
    toast.add({title: 'You updated the team'});
    refreshMyTeam();
    refreshAnimation();
  }, (error) => {
    toast.add({
      title: 'Error while updating the team',
      description: error.data.message,
      color: 'error',
    });
  });
}

function toggleSubscriptionOpen() {
  $fetch(`/api/animations/${route.params.id}/toggle-subscription`, {
    method: 'POST'
  })
  .then((success) => {
    if (animation.value.openSubscription) {
      toast.add({title: 'Subscriptions are now closed'});
    }
    else {
      toast.add({title: 'Subscriptions are now open !'});
    }
    refreshAnimation();
  }, (error) => {
    toast.add({
      title: 'Error while toggleing subscriptions',
      description: error.data.message,
      color: 'error',
    });
  });
}

function saveScoreTeams() {
  if (animation.value.teams === undefined) {
    toast.add({title: 'No team to save score for.', color: 'error'});
    return;
  }
  const scores: TeamScorePost[] = animation.value.teams.map((team) => {
    return {
      teamId: team.id,
      score: team.score ?? 0,
    };
  });
  $fetch(`/api/animations/${route.params.id}/teams/scores`, {
    method: 'POST',
    body: scores,
  })
  .then((success) => {
    toast.add({title: 'Teams scores saved'});
    refreshAnimation();
  }, (error) => {
    toast.add({
      title: 'Error while saving scores',
      description: error.data.message,
      color: 'error',
    });
  });
}

function saveScorePlayers() {
  if (animation.value.players === undefined) {
    toast.add({title: 'No player to save score for.', color: 'error'});
    return;
  }
  const scores: PlayerScorePost[] = animation.value.players.map((player) => {
    return {
      playerId: player.playerId,
      score: player.score ?? 0,
    };
  });
  $fetch(`/api/animations/${route.params.id}/players/scores`, {
    method: 'POST',
    body: scores,
  })
  .then((success) => {
    toast.add({title: 'Players scores saved'});
    refreshAnimation();
  }, (error) => {
    toast.add({
      title: 'Error while saving players scores',
      description: error.data.message,
      color: 'error',
    });
  });
}

function indexToPos(index: number) {
  if (index === 0) {
    return `${index + 1}er`;
  }
  else {
    return `${index + 1}ème`
  }
}
</script>

<template>
    <div v-if="isAdmin">
      <UButton label="Edit" :to="`/animations/${animation?.id}/edit`" />
      <UButton label="Toggle subscription" @click="toggleSubscriptionOpen()" class="ml-4" />
      <USlideover title="Manage scores">
        <UButton label="Manage scores" class="ml-4" />

        <template #body>
          <UForm v-if="animation.isTeamed">
            <UFieldGroup v-for="team in animation.teams" :key="team.id">
              <UBadge color="neutral" variant="outline" size="lg" :label="team.name" class="w-60"/>
              <UInput color="neutral" variant="outline" class="w-16" type="number" v-model="team.score" />
            </UFieldGroup>
            
            <UFormField class="mt-4">
              <UButton type="submit" label="Save score" @click="saveScoreTeams()" />
            </UFormField>
          </UForm>

          <UForm v-else>
            <UFieldGroup v-for="player in animation.players" :key="player.playerId">
              <UBadge color="neutral" variant="outline" size="lg" :label="player.player.username" class="w-60"/>
              <UInput color="neutral" variant="outline" placeholder="Points" class="w-16" type="number" v-model="player.score" />
            </UFieldGroup>
            
            <UFormField class="mt-4">
              <UButton type="submit" label="Save score" @click="saveScorePlayers()" />
            </UFormField>
          </UForm>
        </template>
      </USlideover>
      <UModal title="Are you sure" description="Do you really want to delete this animation ?" >
        <UButton label="Delete" color="error" variant="outline" class="ml-16" />

        <template #body>
          <UButton label="Yes, delete" color="error" variant="outline" class="ml-4" @click="deleteAnimation()"/>
        </template>
      </UModal>
    </div>

    <UPageSection
      :ui="{container: 'py-4 sm:py-6 lg:py-12'}"
      :headline="`${animation?.lanDay?.name} ${animation?.startTime}`"
      :title="animation?.name">

      <template v-if="animation.openSubscription" #links>
        <USlideover v-if="animation.isTeamed" title="Gestion d'équipes">
          <UButton label="Gestion d'équipes" />

          <template #body>
            <UPageList>

              <UPageCard v-for="team in animation.teams" :key="team.id">
                <template #title>
                  <template v-if="myTeam?.id === team.id">
                    <UFieldGroup>
                      <UInput v-model="myTeam.name" />
                      <UButton color="success" variant="outline" label="Save" @click="updateMyTeamName()" />
                    </UFieldGroup>
                  </template>
                  <template v-else>
                    {{ team.name }}
                  </template>
                </template>
                <template #description>
                  {{ team.players.length }} inscrits
                  <template v-if="animation.maxPlayerPerTeam !== null">
                    / {{ animation.maxPlayerPerTeam }}
                  </template>
                </template>
                <template #footer>
                  <template v-if="myTeam?.id === team.id">
                    <UButton label="Quitter" color="error" @click="leaveTeam()" />
                    <UModal title="Are you sure" description="Do you really want to delete your team ?" >
                      <UButton label="Supprimer l'équipe" color="error" variant="outline" class="ml-16" />

                      <template #body>
                        <UButton label="Oui, supprime mon équipe !" color="error" variant="outline" class="ml-4" @click="deleteMyTeam()"/>
                      </template>
                    </UModal>
                  </template>
                  <UButton v-else-if="myTeam?.id === undefined" label="Rejoindre" @click="joinTeam(team.id)" />
                </template>
              </UPageCard>

              <UPageCard v-if="myTeam?.id === undefined">
                <UForm>
                  <UFieldGroup>
                    <UInput placeholder="Créer une nouvelle équipe" v-model="newTeam.name" />
                    <UButton color="success" label="Créer" @click="createNewTeam()" />
                  </UFieldGroup>
                </UForm>
              </UPageCard>

            </UPageList>
          </template>
        </USlideover>

        <UButton v-else v-bind="subscribeButton" />
      </template>

      <template #description>
        <p v-html="`${animation.description?.replaceAll('\n', '<br />')}`" />
      </template>
    </UPageSection>

    <div class="flex w-full gap-16 justify-center flex-wrap">
      <div class="w-54" v-if="animation.isTeamed">
        <UBanner title="Team inscrites" color="secondary" />
        <UPageList divide>
          <UPageCard v-for="team in animation.teams" :key="team.id" :highlight="myTeam?.id === team.id">
            <UUser :name="team.name" size="md" class="h-1" />
          </UPageCard>
        </UPageList>
      </div>
      <div class="w-54" v-else>
        <UBanner title="Inscrits" color="secondary" />
        <UPageList divide>
          <UPageCard v-for="player in animation.players" :key="player.playerId">
            <UUser :name="player.player.username" size="md" class="h-1" />
          </UPageCard>
        </UPageList>
      </div>
      
      <div class="w-54">
        <UBanner title="Responsable" color="secondary" />
        <UPageList divide>
          <UPageCard>
            <UUser :name="animation.adminUser?.username" size="md" />
          </UPageCard>
        </UPageList>
      </div>

      <div class="w-54">
        <UBanner title="Scores" color="secondary" />
        <UPageList divide>
          <template v-if="animation.isTeamed">
            <UPageCard v-for="(team, index) in animation.teams?.toSorted((a,b) => (b.score ?? 0) - (a.score ?? 0))" :key="team.id">
              <UUser :name="team.name" :description="`+${team.score ?? 0}pts`" size="md" class="gap-4">
                <template #avatar>
                  {{ indexToPos(index) }}
                </template>
              </UUser>
            </UPageCard>
          </template>
          <template v-else>
            <UPageCard v-for="(player, index) in animation.players?.toSorted((a,b) => (b.score ?? 0) - (a.score ?? 0))" :key="player.playerId">
              <UUser :name="player.player.username" :description="`+${player.score ?? 0}pts`" size="md" class="gap-4">
                <template #avatar>
                  {{ indexToPos(index) }}
                </template>
              </UUser>
            </UPageCard>
          </template>
        </UPageList>
      </div>
    </div>

</template>
