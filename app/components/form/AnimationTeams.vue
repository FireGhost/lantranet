<script setup lang="ts">
import type { AnimationGetPayload, TeamModel } from '~~/prisma/generated/prisma/models';

const props = defineProps<{
  animation: Partial<AnimationGetPayload<{include: {
    teams: {include: {
      players: true
    }}
  }}>>
}>();

const emit = defineEmits<{
  (e: 'teamsUpdated'): void,
}>();

const { user } = useUserSession();

const myTeamId = computed(() => {
  let teamId = undefined;
  props.animation.teams?.forEach((team) => {
    team.players.forEach((player) => {
      if (player.playerId === user.value?.id) {
        teamId = team.id;
      }
    });
  });
  return teamId;
});

const newTeam = ref<Partial<TeamModel>>({});

function createNewTeam() {
  useApi(
    `/api/animations/${props.animation.id}/teams/add`,
    {
      fetchOptions: {
        method: 'POST',
        body: newTeam.value,    
      },
      successString: 'New team created !',
      onSuccess: () => emit('teamsUpdated'),
    }
  );
}

function leaveTeam() {
  const subscribeBody: SubscribePost = {
    subscribe: false,
  };
  useApi(
    `/api/animations/${props.animation.id}/teams/${myTeamId}/subscribe`,
    {
      fetchOptions: {
        method: 'POST',
        body: subscribeBody,    
      },
      successString: 'You left the team',
      onSuccess: () => emit('teamsUpdated'),
    }
  );
}

function joinTeam(teamId: number) {
  const subscribeBody: SubscribePost = {
    subscribe: true,
  };
  useApi(
    `/api/animations/${props.animation.id}/teams/${teamId}/subscribe`,
    {
      fetchOptions: {
        method: 'POST',
        body: subscribeBody,    
      },
      successString: 'You joined a team',
      onSuccess: () => emit('teamsUpdated'),
    }
  );
}

function deleteMyTeam() {
  useApi(
    `/api/animations/${props.animation.id}/teams/${myTeamId}/delete`,
    {
      fetchOptions: {
        method: 'POST',
      },
      successString: 'You deleted the team',
      onSuccess: () => emit('teamsUpdated'),
    }
  );
}

function updateMyTeamName(myTeam: TeamModel) {
  useApi(
    `/api/animations/${props.animation.id}/teams/${myTeamId}/update`,
    {
      fetchOptions: {
        method: 'POST',
        body: myTeam,    
      },
      successString: 'You updated the team',
      onSuccess: () => emit('teamsUpdated'),
    }
  );
}
</script>

<template>
  <UPageList>

    <UPageCard v-for="team in animation.teams" :key="team.id">
      <template #title>
        <template v-if="myTeamId === team.id">
          <UFieldGroup>
            <UInput v-model="team.name" />
            <UButton color="success" variant="outline" label="Save" @click="updateMyTeamName(team)" />
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
        <template v-if="myTeamId === team.id">
          <UButton label="Quitter" color="error" @click="leaveTeam()" />
          <UModal title="Are you sure" description="Do you really want to delete your team ?" >
            <UButton label="Supprimer l'équipe" color="error" variant="outline" class="ml-16" />

            <template #body>
              <UButton label="Oui, supprime mon équipe !" color="error" variant="outline" class="ml-4" @click="deleteMyTeam()"/>
            </template>
          </UModal>
        </template>
        <UButton v-else-if="myTeamId === undefined" label="Rejoindre" @click="joinTeam(team.id)" />
      </template>
    </UPageCard>

    <UPageCard v-if="myTeamId === undefined">
      <UForm>
        <UFieldGroup>
          <UInput placeholder="Créer une nouvelle équipe" v-model="newTeam.name" />
          <UButton color="success" label="Créer" @click="createNewTeam()" />
        </UFieldGroup>
      </UForm>
    </UPageCard>

  </UPageList>
</template>