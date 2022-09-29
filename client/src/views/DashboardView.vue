<template>
  <div>Dashboard</div>
</template>

<script setup lang="ts">
import { useStore } from "@/stores/main";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();

const { isAuthenticated } = store.$state.auth;

if (isAuthenticated === false) {
  router.replace({ name: "login" });
}
</script>
