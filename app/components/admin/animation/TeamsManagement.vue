<script setup lang="ts">
import type { SelectItem } from '@nuxt/ui';
import type { AnimationGetPayload, PlayersTeamsCreateInput, TeamCreateInput, TeamUpdateInput } from '~~/prisma/generated/prisma/models';

const props = defineProps<{
  animation: AnimationGetPayload<{
    include: {
      teams: {
        include: {
          players: {
            include: {
              player: true,
            },
          },
        },
      },
    },
  }>,
}>();

const emit = defineEmits<{
  teamsUpdated: [],
}>();

const { data: users } = useFetch('/api/users', {
  default: () => [],
});
const availableUsers = computed(() => {
  return users.value
  .filter((user) => {
    return !props.animation.teams.find((team) => {
      return team.players.find((teamPlayer) => teamPlayer.playerId === user.id);
    });
  })
  .map((user) => {
    return {
      label: user.username,
      value: user.id,
    } satisfies SelectItem;
  });
});

const newTeamName = ref('');
const selectedUser = ref();

function updateTeamName(teamId: number, teamName: string) {
  console.log(teamName);
  useApi(`/api/teams/${teamId}`, {
    fetchOptions: {
      method: 'PUT',
      body: {
        name: teamName,
      } satisfies TeamUpdateInput,
    },
    successString: $t('Team updated'),
    onSuccess: () => emit("teamsUpdated"),
  });
}

function deleteTeam(teamId: number) {
  useApi(`/api/teams/${teamId}`, {
    fetchOptions: {
      method: 'DELETE',
    },
    successString: $t('Team deleted'),
    onSuccess: () => emit("teamsUpdated"),
  });
}

function createTeam(teamName: string) {
  useApi("/api/teams", {
    fetchOptions: {
      method: 'POST',
      body: {
        animation: {
          connect: {
            id: props.animation.id,
          },
        },
        name: teamName,
      } satisfies TeamCreateInput,
    },
    successString: $t('Team created with success'),
    onSuccess: () => {
      emit("teamsUpdated");
      newTeamName.value = "";
    },
  });
}

function addPlayerTeam(userId: number, teamId: number) {
  useApi(`/api/teams/${teamId}/players`, {
    fetchOptions: {
      method: 'POST',
      body: {
        player: {
          connect: {
            id: userId,
          },
        },
        team: {
          connect: {
            id: teamId,
          },
        },
      } satisfies PlayersTeamsCreateInput,
    },
    successString: $t('Player added'),
    onSuccess: () => {
      emit("teamsUpdated");
      selectedUser.value = null;
    },
  });
}

function removePlayer(teamId: number, playerId: number) {
  useApi(`/api/teams/${teamId}/players/${playerId}`, {
    fetchOptions: {
      method: 'DELETE',
    },
    successString: $t('Player removed'),
    onSuccess: () => emit("teamsUpdated"),
  });
}
</script>

<template>
  <UPageList>
    <UPageCard v-for="team in animation.teams" :key="team.id" class="mb-2">

      <template #title>
        <UButton
          icon="i-lucide-trash"
          label="Delete team"
          color="error"
          variant="outline"
          class="mb-4"
          @click="deleteTeam(team.id)"
        />
        <UForm @submit="updateTeamName(team.id, team.name)">
          <UFieldGroup>
            <UInput v-model="team.name" class="w-60" />
            <UButton
              icon="i-lucide-save"
              color="success"
              type="submit"
            />
          </UFieldGroup>
        </UForm>
      </template>

      <template #description>
        <div v-if="team.players.length" class="mt-4">
          <div class="mb-2">{{ $t("Subscribed") }}</div>
          <UFieldGroup v-for="player in team.players" :key="player.playerId">
            <UBadge :label="player.player.username" variant="outline" class="w-52" color="neutral" size="lg" />
            <UButton icon="i-lucide-user-minus" variant="outline" color="error" @click="removePlayer(team.id, player.playerId)" />
          </UFieldGroup>
        </div>
      </template>

      <template #footer>
        <UForm @submit="addPlayerTeam(selectedUser, team.id)">
          <UFieldGroup>
            <USelect v-model="selectedUser" :items="availableUsers" class="w-52" />
            <UButton type="submit" icon="i-lucide-user-plus" />
          </UFieldGroup>
        </UForm>
      </template>

    </UPageCard>

    <UPageCard>
      <UForm @submit="createTeam(newTeamName)">
        <UFieldGroup>
          <UInput
            v-model="newTeamName"
            :placeholder="$t('Create a new team')"
          />
          <UButton color="success" :label="$t('Create')" type="submit" />
        </UFieldGroup>
      </UForm>
    </UPageCard>

  </UPageList>
</template>
