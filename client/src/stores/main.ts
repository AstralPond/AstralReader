import { defineStore } from "pinia";
import { computed, reactive } from "vue";

interface User {
  email: string;
}

interface Auth {
  user: null | User;
  email: string;
  isAuthenticated: boolean;
}

interface State {
  auth: Auth;
}

export const useStore = defineStore("main", (): State => {
  const auth: Auth = reactive({
    user: null,
    email: "",
    isAuthenticated: computed(() => {
      return !!auth?.user?.email;
    }),
  });

  return { auth };
});
