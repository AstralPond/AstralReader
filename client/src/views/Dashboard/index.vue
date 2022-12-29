<script setup lang="ts">
import useauth from "@/use/auth";
import InitialLibraryView from "./InitialLibrary.vue";

const { auth } = useauth();
</script>
<template>
  <InitialLibraryView v-if="auth.libraryCount === 0" />
  <!-- <nav>astral pond</nav> -->
  <!-- <div> -->
  <!--   <nav>sidebar</nav> -->
  <!--   <div> -->
  <!--     <h1>continue reading</h1> -->
  <!--   </div> -->
  <!-- </div> -->
  <h1 class="desktop-display-huge">create your first library</h1>
</template>
