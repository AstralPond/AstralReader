<script setup lang="ts">
import { useStore } from "@/stores/main";
import useAuth from "@/use/auth";
import { reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const store = useStore();

const { login } = useAuth(store, router);

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
    class="fullscreen d-flex align-items-center align-middle justify-content-center gradient-34"
  >
    <div class="login">
      <img
        class="d-inline-block align-middle"
        src="@/assets/login-image.jpg"
        alt="space graphic"
      />
      <div class="box d-inline-block align-middle">
        <h2 class="desktop-display-x-small text-center">Log In</h2>
        <form
          class="d-flex flex-column"
          @submit.prevent="submit"
          v-on:keyup.enter="submit"
        >
          <div class="email d-flex flex-column">
            <label class="desktop-text-small" for="email">email</label>
            <input
              id="email"
              class="desktop-text-small"
              type="email"
              v-model="form.email"
            />
          </div>
          <div class="password d-flex flex-column">
            <label for="password desktop-text-small">password</label>
            <input id="password" type="password" v-model="form.password" />
          </div>
          <a @click.prevent="submit" class="btn">Log In</a>
        </form>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "@/scss/abstracts/functions";
@use "@/scss/abstracts/mixins";
#login-view {
  color: functions.get-color("alias", "grayscale", "bg");

  img {
    @include mixins.elevation(10);
  }
  input {
    color: functions.get-color("alias", "grayscale", "bg");
    @include mixins.padding-x(2rem);
    border: none;
    background: none;
    border-bottom: 0.2rem solid
      functions.get-color("alias", "grayscale", "body");
    transition-property: border-color;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
    &:focus {
      outline: none;
      border-bottom: 0.2rem solid
        functions.get-color("alias", "grayscale", "bg");
    }
  }
  label {
    @include mixins.padding-x(2rem);
  }

  h2 {
    color: functions.get-color("alias", "grayscale", "input");
  }

  form {
    // TODO: use spacer variables
    gap: 3rem;
  }

  .box {
    background-color: functions.get-color("alias", "grayscale", "header-weak");
    padding: 12rem 25rem;
    @include mixins.elevation(10);
  }
}
</style>
