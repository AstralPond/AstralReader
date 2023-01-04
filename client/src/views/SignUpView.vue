<script lang="ts" setup>
import Button from "@/components/Button.vue";
import LogoIcon from "@/components/icons/Logo.vue";
import TextInput from "@/components/inputs/TextInput.vue";
import useAuth from "@/use/auth";
import { reactive, ref } from "vue";
import { RouterLink } from "vue-router";

// Body to be send to the /gatekeeper/signup endpoint
const bodyData = reactive({
  email: "",
  password: "",
});

const confirmPassword = ref("");

const { signup } = useAuth();

async function submit() {
  signup(bodyData);
}
</script>

<template>
  <div id="background" class="vh-100 bg-alias-secondary-strong">
    <div
      class="fullscreen d-flex justify-content-center align-items-center flex-column"
    >
      <h2 class="d-flex align-items-center flex-column">
        <LogoIcon />
        <span
          class="alias-grayscale-bg desktop-display-x-small fw-3 font-poppins mt-2"
          >Astral Reader</span
        >
      </h2>
      <h1 class="alias-grayscale-input desktop-display-medium my-10">
        Create an account
      </h1>
      <form @submit.prevent="submit" class="gap-6 d-flex flex-column">
        <TextInput
          type="default"
          inputType="email"
          size="medium"
          v-model:value="bodyData.email"
          label="email"
          name="email"
          :darkMode="false"
        />
        <TextInput
          type="default"
          inputType="password"
          size="medium"
          v-model:value="bodyData.password"
          label="password"
          name="password"
          :darkMode="false"
        />
        <TextInput
          type="default"
          inputType="password"
          size="medium"
          v-model:value="confirmPassword"
          label="confirm password"
          name="confirmPassword"
          :darkMode="false"
        />
        <Button
          class="bg-alias-grayscale-header"
          size="medium"
          type="primary"
          color="#14142b"
          >Sign Up</Button
        >
      </form>
      <p class="mt-6 alias-grayscale-line desktop-text-medium">
        Already have an account?
        <RouterLink class="link desktop-link-medium" to="/login"
          >Log in here</RouterLink
        >
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
div#background {
  background-image: url("@/assets/spacex-bg.jpg");
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
}
</style>
