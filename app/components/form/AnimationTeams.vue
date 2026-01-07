<script setup lang="ts">
import type {
  AnimationGetPayload,
  PlayersTeamsCreateInput,
  TeamCreateInput,
  TeamModel,
  TeamUpdateInput,
} from "~~/prisma/generated/prisma/models";

const props = defineProps<{
  animation: AnimationGetPayload<{
    include: {
      teams: {
        include: {
          players: true;
        };
      };
    };
  }>;
}>();

const emit = defineEmits<{
  (e: "teamsUpdated"): void;
}>();

const { user } = useUserSession();
const toast = useToast();

const myTeamId = computed(() => {
  return props.animation.teams.find((team) => {
    return team.players.find(
      (teamUser) => teamUser.playerId === user.value?.id,
    );
  })?.id;
});

const newTeam = ref<Partial<TeamModel>>({});

function createNewTeam() {
  if (!newTeam.value.name?.length) {
    toast.add({
      title: $t("Please enter a team name"),
      color: "error",
    });
    return;
  }

  useApi(`/api/teams`, {
    fetchOptions: {
      method: "POST",
      body: {
        name: newTeam.value.name,
        animation: {
          connect: {
            id: props.animation.id,
          },
        },
      } satisfies TeamCreateInput,
    },
    successString: $t("New team created !"),
    onSuccess: () => {
      emit("teamsUpdated");
      newTeam.value.name = "";
    },
  });
}

function leaveTeam() {
  useApi(`/api/teams/${myTeamId.value}/players/${user.value?.id}`, {
    fetchOptions: {
      method: "DELETE",
    },
    successString: $t("You left the team"),
    onSuccess: () => emit("teamsUpdated"),
  });
}

function joinTeam(teamId: number) {
  if (!user.value) {
    toast.add({
      title: $t("Please login"),
    });
    return;
  }

  useApi(`/api/teams/${teamId}/players`, {
    fetchOptions: {
      method: "POST",
      body: {
        player: {
          connect: {
            id: user.value.id,
          },
        },
        team: {
          connect: {
            id: teamId,
          },
        },
      } satisfies PlayersTeamsCreateInput,
    },
    successString: $t("You joined a team"),
    onSuccess: () => emit("teamsUpdated"),
  });
}

function deleteMyTeam() {
  useApi(`/api/teams/${myTeamId.value}`, {
    fetchOptions: {
      method: "DELETE",
    },
    successString: $t("You deleted the team"),
    onSuccess: () => emit("teamsUpdated"),
  });
}

function updateMyTeamName(myTeam: TeamModel) {
  useApi(`/api/teams/${myTeamId.value}`, {
    fetchOptions: {
      method: "PUT",
      body: {
        name: myTeam.name,
      } satisfies TeamUpdateInput,
    },
    successString: $t("You updated the team"),
    onSuccess: () => emit("teamsUpdated"),
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
            <UButton
              color="success"
              variant="outline"
              :label="$t('Save')"
              @click="updateMyTeamName(team)"
            />
          </UFieldGroup>
        </template>
        <template v-else>
          {{ team.name }}
        </template>
      </template>

      <template #description>
        {{ team.players.length }} {{ $t("subscribed") }}
        <template v-if="animation.maxPlayerPerTeam !== null">
          / {{ animation.maxPlayerPerTeam }}
        </template>
      </template>

      <template #footer>
        <template v-if="myTeamId === team.id">
          <UButton :label="$t('Leave')" color="error" @click="leaveTeam()" />
          <UModal
            :title="$t('Are you sure')"
            :description="$t('Do you really want to delete your team ?')"
          >
            <UButton
              :label="$t('Delete the team')"
              color="error"
              variant="outline"
              class="ml-16"
            />

            <template #body>
              <UButton
                :label="$t('Yes, delete my team !')"
                color="error"
                variant="outline"
                class="ml-4"
                @click="deleteMyTeam()"
              />
            </template>
          </UModal>
        </template>
        <UButton
          v-else-if="myTeamId === undefined"
          :label="$t('Join')"
          class="block"
          @click="joinTeam(team.id)"
        />
      </template>
    </UPageCard>

    <UPageCard v-if="myTeamId === undefined">
      <UForm @submit="createNewTeam">
        <UFieldGroup>
          <UInput
            v-model="newTeam.name"
            :placeholder="$t('Create a new team')"
          />
          <UButton color="success" :label="$t('Create')" type="submit" />
        </UFieldGroup>
      </UForm>
    </UPageCard>
  </UPageList>
</template>
