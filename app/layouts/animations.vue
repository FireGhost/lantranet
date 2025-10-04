<script setup lang="ts">
import { Role, type Prisma } from '@prisma/client';

const { user } = useUserSession();
const isAdmin = computed(() => user.value?.role === Role.ADMIN);

const { data: lanDays, refresh: refreshAnimations } = await useFetch<Prisma.LanDayGetPayload<{include: {animations: true}}>[]>('/api/lan-days', {
  query: {includeAnimations: true}
});

const lanDaysSorted = computed(() => {
  lanDays.value?.forEach((lanDay) => lanDay.animations.sort((a, b) => a.weight - b.weight));
  return lanDays.value?.sort((a, b) => a.weight - b.weight)
});
</script>

<template>
  <UPage>

    <template #left>

        <UPageList divide>
          <UPageCard v-if="isAdmin" variant="ghost" to="/animations/create">
            <template #body>
              <UUser name="+ Create" class="h-1" />
            </template>
          </UPageCard>

          <template v-for="lanDay in lanDaysSorted" :key="lanDay.id">
            <UPageCard variant="soft" :title="lanDay.name" />

            <UPageCard v-for="animation in lanDay.animations" :key="animation.id" :to="`/animations/${animation.id}`">
              <template #body>
                <UUser size="md">
                  <template #name>
                    {{ animation.shortName?.length ? animation.shortName : animation.name }}
                  </template>
                  <template #description>
                    {{ animation.startTime }}
                  </template>
                </UUser>
              </template>
            </UPageCard>
          </template>

          <UPageCard variant="soft" to="/animations/scores">
            <template #body>
              <UBadge label="Scores" size="lg" class="px-8" />
            </template>
          </UPageCard>
        
        </UPageList>

    </template>

    <div class="mt-4 mb-8">
      <slot />
    </div>

  </UPage>
</template>
