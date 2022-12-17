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
  <div id="login">
    <div class="login">
      <img src="@/assets/login-image.jpg" alt="space graphic" />
      <div class="box">
        <h2>Log In</h2>
        <form @submit.prevent="submit" v-on:keyup.enter="submit">
          <div class="email">
            <label for="email">email</label>
            <input id="email" type="email" v-model="form.email" />
          </div>
          <div class="password">
            <label for="password">password</label>
            <input id="password" type="password" v-model="form.password" />
          </div>
          <a @click.prevent="submit" class="btn">Log In</a>
        </form>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "@/scss/base/depth";
img {
  @include depth.elevation(10);
}
</style>
