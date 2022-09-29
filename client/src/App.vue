<template>
  <div>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import "./scss/main.module.scss";
import { useStore } from "@/stores/main";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();

// Runs everytime state is changed
// Redirects page to /dashboard or /login based on isAuthenticated
store.$subscribe(
  (_mutation, state) => {
    const { isAuthenticated } = state.auth;
    if (isAuthenticated) {
      router.replace({ name: "dashboard" });
    } else {
      router.replace({ name: "login" });
    }
  },
  { immediate: true }
);
</script>
