<script setup lang="ts">
import Button from "@/components/Button.vue";
import TextInput from "@/components/inputs/TextInput.vue";
import useAuth from "@/use/auth";
import { reactive } from "vue";

const { login } = useAuth();

const form = reactive({
  email: "",
  password: "",
});

function submit() {
  login(form);
}
</script>

<template>
  <div
    id="login-view"
    class="alias-grayscale-bg fullscreen d-flex align-items-center align-middle justify-content-center gradient-34"
  >
    <div class="login">
      <img
        class="d-inline-block align-middle elevate-10"
        src="@/assets/login-image.jpg"
        alt="space graphic"
      />
      <div
        id="box"
        class="bg-alias-grayscale-header d-inline-block align-middle elevate-10"
      >
        <h2
          class="alias-grayscale-input desktop-display-x-small text-center mb-9"
        >
          Log In
        </h2>
        <form
          class="d-flex flex-column gap-y-8"
          @submit.prevent="submit"
          v-on:keyup.enter="submit"
        >
          <TextInput
            name="email"
            v-model:value="form.email"
            type="underlined"
            size="medium"
            inputType="text"
            :showIcon="false"
            :darkMode="true"
            label="email"
          />
          <TextInput
            name="password"
            v-model:value="form.password"
            type="underlined"
            size="medium"
            inputType="password"
            :show-icon="false"
            :dark-mode="true"
            label="password"
          />
          <Button type="primary" size="small" :darkMode="true" :showIcon="false"
            >Log In</Button
          >
          <!-- <button class="btn">Log In</button> -->
        </form>
        <p class="mt-6 alias-grayscale-line desktop-text-small text-center">
          Need an account?
          <RouterLink class="link-dark desktop-link-small" to="/signup"
            >Sign up here</RouterLink
          >
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#box {
  padding: 12rem 25rem;
}
</style>
