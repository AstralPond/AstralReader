import urql from "@urql/vue";
import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);
const pinia = createPinia();

app
  .use(pinia)
  .use(urql, {
    url: "http://localhost:3000/graphql",
  })
  .use(router)
  .mount("#app");
