import { defineStore } from "pinia";
import { computed, reactive } from "vue";

export interface User {
  email: string;
  libraries: Library[];
}

export interface Library {
  name: string;
  folders: Folder[];
}

export interface Folder {
  basePath: string;
  publicPath: string;
}

export interface Auth {
  user: null | User;
  isAuthenticated: boolean;
}

export interface State {
  auth: Auth;
}

export const useStore = defineStore("main", (): State => {
  const auth: Auth = reactive({
    user: null,
    isAuthenticated: computed(() => {
      return !!auth?.user?.email;
    }),
  });

  return { auth };
});
