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

  useApi(
    `/api/animations/${route.params.id}/subscribe`,
    {
      fetchOptions: {
        method: 'POST',
        body: subscribeBody,
      },
      successString: 'You have been removed',
      onSuccess: () => {
        updateSubscribeButton();
        refreshAnimation();
      }
    }
  );
}

function subscribeSolo() {
  const subscribeBody: SubscribePost = {
    subscribe: true
  }
  useApi(
    `/api/animations/${route.params.id}/subscribe`,
    {
      fetchOptions: {
        method: 'POST',
        body: subscribeBody,
      },
      successString: 'Subscribed !',
      onSuccess: () => {
        updateSubscribeButton();
        refreshAnimation();
      }
    }
  );
}

function deleteAnimation() {
  useApi(
    '/api/animations/delete',
    {
      fetchOptions: {
        method: 'POST',
        body: animation.value,
      },
      successString: 'Animation removed',
      onSuccess: () => navigateTo('/animations'),
    }
  );
}

function createNewTeam() {
  useApi(
    `/api/animations/${route.params.id}/teams/add`,
    {
      fetchOptions: {
        method: 'POST',
        body: newTeam.value,    
      },
      successString: 'New team created !',
      onSuccess: () => {
        refreshMyTeam();
        refreshAnimation();
      }
    }
  );
}

function leaveTeam() {
  const subscribeBody: SubscribePost = {
    subscribe: false,
  };
  useApi(
    `/api/animations/${route.params.id}/teams/${myTeam.value?.id}/subscribe`,
    {
      fetchOptions: {
        method: 'POST',
        body: subscribeBody,    
      },
      successString: 'You left the team',
      onSuccess: () => {
        refreshMyTeam();
        refreshAnimation();
      }
    }
  );
}

function joinTeam(teamId: number) {
  const subscribeBody: SubscribePost = {
    subscribe: true,
  };
  useApi(
    `/api/animations/${route.params.id}/teams/${teamId}/subscribe`,
    {
      fetchOptions: {
        method: 'POST',
        body: subscribeBody,    
      },
      successString: 'You joined a team',
      onSuccess: () => {
        refreshMyTeam();
        refreshAnimation();
      }
    }
  );
}

function deleteMyTeam() {
  useApi(
    `/api/animations/${route.params.id}/teams/${myTeam.value?.id}/delete`,
    {
      fetchOptions: {
        method: 'POST',
      },
      successString: 'You deleted the team',
      onSuccess: () => {
        refreshMyTeam();
        refreshAnimation();
      }
    }
  );
}

function updateMyTeamName() {
  useApi(
    `/api/animations/${route.params.id}/teams/${myTeam.value?.id}/update`,
    {
      fetchOptions: {
        method: 'POST',
        body: myTeam.value,    
      },
      successString: 'You updated the team',
      onSuccess: () => {
        refreshMyTeam();
        refreshAnimation();
      }
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
    `/api/animations/${route.params.id}/toggle-subscription`,
    {
      fetchOptions: {
        method: 'POST',
      },
      successString: successString,
      onSuccess: refreshAnimation,
    }
  );
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
  useApi(
    `/api/animations/${route.params.id}/teams/scores`,
    {
      fetchOptions: {
        method: 'POST',
        body: scores,    
      },
      successString: 'Teams scores saved',
      onSuccess: refreshAnimation,
    }
  );
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
  useApi(
    `/api/animations/${route.params.id}/players/scores`,
    {
      fetchOptions: {
        method: 'POST',
        body: scores,    
      },
      successString: 'Players scores saved',
      onSuccess: () => refreshAnimation,
    }
  );
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
