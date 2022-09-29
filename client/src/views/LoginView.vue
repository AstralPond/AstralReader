<template>
  <div id="login">
    <div class="login">
      <img :src="require('@/assets/login-image.jpg')" alt="space graphic" />
      <div class="box">
        <h2>Log In</h2>
        <form @submit="submit" v-on:keyup.enter="submit">
          <div class="email">
            <label for="email">email</label>
            <input id="email" type="email" v-model="form.email" />
          </div>
          <div class="password">
            <label for="password">password</label>
            <input id="password" type="password" v-model="form.password" />
          </div>
          <a @click="submit" class="btn" href="#">Log In</a>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "@/stores/main";

const router = useRouter();
const store = useStore();

const form = reactive({
  email: "",
  password: "",
});

async function login() {
  try {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();

    if (data.email) {
      store.$patch((state) => {
        state.auth.user = data;
      });

      router.push({ name: "dashboard" });
    }
  } catch (err) {
    console.log(err);
  } finally {
    console.log("done");
  }
}

function submit() {
  login();
}
</script>

<style lang="scss" scoped>
@use "@/scss/abstracts/functions";
@use "@/scss/abstracts/variables";

#login {
  height: 100vh;
  width: 100vw;
  vertical-align: middle;

  display: flex;
  justify-content: center;
  align-items: center;
}

img {
  display: inline-block;
  vertical-align: middle;
}

input {
  font-size: 1.5rem;
  letter-spacing: 0.075rem;
  border: none;
  background: none;
  padding-left: 2rem;
  padding-right: 2rem;
  border-bottom: 2px solid #4e4b66;
  padding-bottom: 0.5rem;
  color: #fcfcfc;

  &:focus {
    outline: none;
    border-bottom: 2px solid #fcfcfc;
  }
}

.email,
.password {
  display: flex;
  flex-direction: column;

  label {
    color: #fcfcfc;
    font-size: 1.3rem;
    letter-spacing: 0.075rem;
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

h2 {
  font-size: 2.4rem;
  text-align: center;
  font-weight: 400;
  letter-spacing: 0.1rem;
  color: functions.map-deep-get(
    variables.$colors,
    "alias",
    "grayscale",
    "input"
  );
  margin-bottom: 5rem;
}

form {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.box {
  display: inline-block;
  background-color: #262338;
  padding: 12rem 25rem;
  /* height: 529px; */
  /* width: 704px; */
  vertical-align: middle;
}

.btn:visited,
.btn:link {
  color: white;
  text-decoration: none;
  background-color: black;
  border-radius: 1.6rem;
  text-align: center;
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
  font-weight: 700;
}
</style>
