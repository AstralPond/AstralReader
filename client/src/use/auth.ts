import {useStore, type State} from "@/stores/main";
import {storeToRefs, type Store} from "pinia";
import {useRouter, type Router} from "vue-router";

/**
 * Checks with server if cookie authentication is valid, then updates
 * the pinia state with the server response
 *
 * @example
 * <template>
 *     <form @submit="onSubmit"></form>
 * </template>
 * <script setup lang="ts">
 *  import useAuth from "@/use/auth"
 *
 *  const {auth, login } = useAuth()
 *
 *  function onSubmit(e) {
 *      e.preventDefault();
 *      login();
 *  }
 * </script>
 *
 */
export default function useAuth(s?: Store<"main", State>, r?: Router) {
  const store = s || useStore();
  const router = r || useRouter();
  const { auth } = storeToRefs(store);
  loadCookie(store);

  return { auth, login: login(store, router), refetchUserData: () => loadCookie(store) };
}

interface LoginBody {
  email: string;
  password: string;
}

function login(store: Store, router: Router) {
  return async (body: LoginBody) => {
    try {
      // TODO: make url dynamic
      const response = await fetch("http://localhost:3000/gatekeeper/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.status === 200) {
        const data = await response.json();

        if (data.email) {
          store.$patch((state: State) => {
            state.auth.user = data;
          });

          router.push({ name: "dashboard" });
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      console.log("done");
    }
  };
}

// Loads cookie stored on browser and updates user data
async function loadCookie(store: Store) {
  // Update auth store
  const response = await fetch("http://localhost:3000/gatekeeper", {
    credentials: "include",
  });

  if (response.status === 200) {
    const data = await response.json();

    if (data.email) {
      store.$patch((state: State) => {
        state.auth.user = data;
      });
    }
  } else {
    store.$patch((state: State) => {
      state.auth.user = null;
    });
  }
}
