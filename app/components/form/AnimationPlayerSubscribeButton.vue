<script setup lang="ts">
import type { SelectItem } from "@nuxt/ui";
import { Role } from "~~/prisma/generated/prisma/enums";
import type { AnimationsPlayersCreateInput } from "~~/prisma/generated/prisma/models";

const props = defineProps<{
  animationId: number;
}>();

const emit = defineEmits<{
  (e: "playerSubscriptionUpdated"): void;
}>();

const { user } = useUserSession();
const isAdmin = user.value?.role === Role.ADMIN;

const { data: usersItems } = useFetch('/api/users', {
  transform: (users) => {
    return users
    .map((user) => ({
      label: user.username,
      value: user.id,
    } satisfies SelectItem ));
  },
});

const { data: playerSubscription, refresh: refreshSubscriptionData } =
  await useFetch(
    `/api/animations/${props.animationId}/players/${user.value?.id}`,
  );

const selectedUserToAdd = ref();

function unsubscribeSolo() {
  useApi(`/api/animations/${props.animationId}/players/${user.value?.id}`, {
    fetchOptions: {
      method: "DELETE",
    },
    successString: "You have been removed",
    onSuccess: () => {
      refreshSubscriptionData();
      emit("playerSubscriptionUpdated");
    },
  });
}

function subscribeSolo() {
  if (!user.value) {
    useToast().add({
      title: "Please login again",
    });
    return;
  }

  useApi(`/api/animations/${props.animationId}/players`, {
    fetchOptions: {
      method: "POST",
      body: {
        animation: {
          connect: {
            id: Number(props.animationId),
          },
        },
        player: {
          connect: {
            id: user.value.id,
          },
        },
      } satisfies AnimationsPlayersCreateInput,
    },
    successString: "Subscribed !",
    onSuccess: () => {
      refreshSubscriptionData();
      emit("playerSubscriptionUpdated");
    },
  });
}

function subscribePlayer() {
  useApi(`/api/animations/${props.animationId}/players`, {
    fetchOptions: {
      method: 'POST',
      body: {
        animation: {
          connect: {
            id: Number(props.animationId),
          },
        },
        player: {
          connect: {
            id: selectedUserToAdd.value,
          },
        },
      } satisfies AnimationsPlayersCreateInput,
    },
    successString: 'Players added with success',
    onSuccess: () => selectedUserToAdd.value = null,
  });
}
</script>

<template>
  <div>
    <div class="w-fit m-auto">
      <UButton
        v-if="playerSubscription"
        label="Je me retire"
        color="error"
        @click="unsubscribeSolo()"
      />
      <UButton
        v-else
        label="Inscris moi !"
        color="primary"
        @click="subscribeSolo()"
      />
    </div>

    <template v-if="isAdmin">
      <UForm class="mt-4" @submit="subscribePlayer">
        <UFieldGroup>
          <USelect v-model="selectedUserToAdd" :items="usersItems" class="w-52" />
          <UButton type="submit" icon="i-lucide-user-round-plus" />
        </UFieldGroup>
      </UForm>
    </template>
  </div>
</template>
