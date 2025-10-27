<script setup lang="ts">
import type { AnimationGetPayload, AnimationsPlayersUpdateInput, TeamUpdateInput } from '~~/prisma/generated/prisma/models';

const props = defineProps<{
  animation: Partial<AnimationGetPayload<{include: {
    teams: true,
    players: {include : {
      player: true
    }}
  }}>>
}>();

const emit = defineEmits<{
  playerScoreUpdated: [],
  teamScoreUpdated: [],
}>();

function saveScoreTeams() {
  for (const team of props.animation.teams ?? []) {
    useApi(
      `/api/teams/${team.id}`,
      {
        fetchOptions: {
          method: 'PUT',
          body: {
            score: team.score,
          } satisfies TeamUpdateInput,    
        },
        successString: 'Teams scores saved',
        onSuccess: () => emit('teamScoreUpdated'),
      }
    );
  }
}

function saveScorePlayers() {
  for (const playerAnimation of props.animation.players ?? []) {
    useApi(
      `/api/animations/${props.animation.id}/players/${playerAnimation.playerId}`,
      {
        fetchOptions: {
          method: 'PUT',
          body: {
            score: playerAnimation.score,
          } satisfies AnimationsPlayersUpdateInput,    
        },
        successString: 'Players scores saved',
        onSuccess: () => emit('playerScoreUpdated'),
      }
    );
  }
}
</script>

<template>
  <UForm v-if="animation.isTeamed">
    <UFieldGroup v-for="team in animation.teams" :key="team.id">
      <UBadge color="neutral" variant="outline" size="lg" :label="team.name" class="w-60"/>
      <UInput v-model="team.score" color="neutral" variant="outline" class="w-16" type="number" />
    </UFieldGroup>
    
    <UFormField class="mt-4">
      <UButton type="submit" label="Save score" @click="saveScoreTeams()" />
    </UFormField>
  </UForm>

  <UForm v-else>
    <UFieldGroup v-for="playerSubscription in animation.players" :key="playerSubscription.playerId">
      <UBadge color="neutral" variant="outline" size="lg" :label="playerSubscription.player.username" class="w-60"/>
      <UInput v-model="playerSubscription.score" color="neutral" variant="outline" placeholder="Points" class="w-16" type="number" />
    </UFieldGroup>
    
    <UFormField class="mt-4">
      <UButton type="submit" label="Save score" @click="saveScorePlayers()" />
    </UFormField>
  </UForm>
</template>