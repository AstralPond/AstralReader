<template>
  <div>
    <router-view v-slot="{ Component }">
      <Transition name="page-fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "@/stores/main";
import useAuth from "@/use/auth";
import { useClient } from "villus";
import { useRouter } from "vue-router";
import "./scss/main.scss";

const store = useStore();
const router = useRouter();
const { fetchUserData } = useAuth(store, router);

// Loads user data into pinia state using cookies
fetchUserData();

useClient({
  url: "http://localhost:3000/graphql",
});

// Runs everytime state is changed
// Redirects page to /dashboard or /login based on isAuthenticated
store.$subscribe(
  (_mutation, state) => {
    const { isAuthenticated } = state.auth;
    if (isAuthenticated) {
      router.replace({ name: "dashboard" });
    }
  },
  { immediate: true }
);
</script>
