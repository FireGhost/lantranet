<script setup lang="ts">
import type { AnimationGetPayload } from '~~/prisma/generated/prisma/models';

const props = defineProps<{
  animation: Partial<AnimationGetPayload<{include: {
    teams: true,
    players: {include : {
      player: true
    }}
  }}>>
}>();

const toast = useToast();

function saveScoreTeams() {
  if (props.animation.teams === undefined) {
    toast.add({title: 'No team to save score for.', color: 'error'});
    return;
  }
  const scores: TeamScorePost[] = props.animation.teams.map((team) => {
    return {
      teamId: team.id,
      score: team.score ?? 0,
    };
  });
  useApi(
    `/api/animations/${props.animation.id}/teams/scores`,
    {
      fetchOptions: {
        method: 'POST',
        body: scores,    
      },
      successString: 'Teams scores saved'
    }
  );
}

function saveScorePlayers() {
  if (props.animation.players === undefined) {
    toast.add({title: 'No player to save score for.', color: 'error'});
    return;
  }
  const scores: PlayerScorePost[] = props.animation.players.map((player) => {
    return {
      playerId: player.playerId,
      score: player.score ?? 0,
    };
  });
  useApi(
    `/api/animations/${props.animation.id}/players/scores`,
    {
      fetchOptions: {
        method: 'POST',
        body: scores,    
      },
      successString: 'Players scores saved'
    }
  );
}
</script>

<template>
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
    <UFieldGroup v-for="playerSubscription in animation.players" :key="playerSubscription.playerId">
      <UBadge color="neutral" variant="outline" size="lg" :label="playerSubscription.player.username" class="w-60"/>
      <UInput color="neutral" variant="outline" placeholder="Points" class="w-16" type="number" v-model="playerSubscription.score" />
    </UFieldGroup>
    
    <UFormField class="mt-4">
      <UButton type="submit" label="Save score" @click="saveScorePlayers()" />
    </UFormField>
  </UForm>
</template>