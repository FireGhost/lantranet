<script setup lang="ts">
import type { AnimationGetPayload } from '~~/prisma/generated/prisma/models';

const { user } = useUserSession();

const props = defineProps<{
  animation: Partial<AnimationGetPayload<{include: {
    teams: { include: {
      players: true,
    }},
    players: {include: {
      player: true
    }},
    adminUser: true
  }}>>
}>();

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
  <div class="flex w-full gap-16 justify-center flex-wrap">
    
    <div class="w-54" v-if="animation.isTeamed">
      <UBanner title="Team inscrites" color="secondary" />
      <UPageList divide>
        <UPageCard v-for="team in animation.teams" :key="team.id" :highlight="myTeamId === team.id">
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