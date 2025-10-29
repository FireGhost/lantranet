<script setup lang="ts">
import type { TableColumn, TableData } from "@nuxt/ui";
import type {
  LanDayGetPayload,
  UserGetPayload,
} from "~~/prisma/generated/prisma/models";

useHead({
  title: "Scores",
});

definePageMeta({
  layout: "animations",
});

const { data: lanDays } = await useFetch<
  LanDayGetPayload<{
    include: { animations: true };
  }>[]
>("/api/lan-days", {
  query: { includeAnimations: true, orderByWeight: true },
});

const { data: usersScores } = await useFetch<
  UserGetPayload<{
    include: {
      animationsAsPlayer: {
        include: {
          animation: true;
        };
      };
      teams: {
        include: {
          team: {
            include: {
              animation: true;
            };
          };
        };
      };
    };
  }>[]
>("/api/users", {
  query: { withTeams: true, withAnimationsAsPlayer: true },
});

let firstLoop = true;
const data = ref<{ username: string; scoreTotal: number }[]>([]);
const columns: TableColumn<TableData>[] = [];
usersScores.value?.forEach((userScores) => {
  const userData: any = {};
  let scoreTotal = 0;
  userData.username = userScores.username;

  if (firstLoop) {
    columns.push({
      accessorKey: "username",
      header: "Username",
    });
  }

  lanDays.value?.forEach((lanDay) => {
    lanDay.animations.forEach((animation) => {
      if (firstLoop) {
        columns.push({
          accessorKey: `${animation.id}`,
          header: animation.shortName?.length
            ? animation.shortName
            : animation.name,
        });
      }

      let score = 0;
      if (animation.isTeamed) {
        score =
          userScores.teams.find(
            (userTeam) => userTeam.team.animationId === animation.id,
          )?.team.score ?? 0;
      } else {
        score =
          userScores.animationsAsPlayer.find(
            (animationAsPlayer) =>
              animationAsPlayer.animationId === animation.id,
          )?.score ?? 0;
      }

      userData[`${animation.id}`] = score;
      scoreTotal += score;
    });
  });

  userData.scoreTotal = scoreTotal;
  if (firstLoop) {
    columns.push({
      accessorKey: "scoreTotal",
      header: "Total",
    });
  }

  data.value.push(userData);

  firstLoop = false;
});

data.value.sort((a, b) => b.scoreTotal - a.scoreTotal);
</script>

<template>
  <UTable :data="data" :columns="columns" />
</template>
