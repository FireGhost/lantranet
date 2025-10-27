<script setup lang="ts">
import type { AnimationGetPayload, PlayersTeamsCreateInput, TeamCreateInput, TeamModel, TeamUpdateInput } from '~~/prisma/generated/prisma/models';

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
const toast = useToast();

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
  if (!newTeam.value.name) {
    toast.add({
      title: 'Please enter a team name',
      color: 'error',
    });
    return;
  }

  useApi(`/api/teams`, {
    fetchOptions: {
      method: 'POST',
      body: {
        name: newTeam.value.name,
        animation: {
          connect: {
            id: props.animation.id,
          }
        }
      } satisfies TeamCreateInput,    
    },
    successString: 'New team created !',
    onSuccess: () => {
      emit('teamsUpdated');
      newTeam.value.name = '';
    },
  });
}

function leaveTeam() {
  useApi(`/api/teams/${myTeamId.value}/players/${user.value?.id}`, {
    fetchOptions: {
      method: 'DELETE',
    },
    successString: 'You left the team',
    onSuccess: () => emit('teamsUpdated'),
  });
}

function joinTeam(teamId: number) {
  if (!user.value) {
    toast.add({
      title: 'Please login'
    });
    return;
  }

  useApi(`/api/teams/${teamId}/players`, {
    fetchOptions: {
      method: 'POST',
      body: {
        player: {
          connect: {
            id: user.value.id
          }
        },
        team: {
          connect: {
            id: teamId
          }
        }
      } satisfies PlayersTeamsCreateInput,    
    },
    successString: 'You joined a team',
    onSuccess: () => emit('teamsUpdated'),
  });
}

function deleteMyTeam() {
  useApi(`/api/teams/${myTeamId.value}`, {
    fetchOptions: {
      method: 'DELETE',
    },
    successString: 'You deleted the team',
    onSuccess: () => emit('teamsUpdated'),
  });
}

function updateMyTeamName(myTeam: TeamModel) {
  useApi(`/api/teams/${myTeamId.value}`, {
    fetchOptions: {
      method: 'PUT',
      body: {
        name: myTeam.name,
      } satisfies TeamUpdateInput,
    },
    successString: 'You updated the team',
    onSuccess: () => emit('teamsUpdated'),
  });
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
          <UInput v-model="newTeam.name" placeholder="Créer une nouvelle équipe" />
          <UButton color="success" label="Créer" @click="createNewTeam()" />
        </UFieldGroup>
      </UForm>
    </UPageCard>

  </UPageList>
</template>