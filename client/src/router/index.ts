import DashboardView from "@/views/Dashboard/index.vue";
import InitialSetupView from "@/views/Dashboard/InitialLibrary.vue";
import LoginView from "@/views/LoginView.vue";
import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: DashboardView,
  },
  {
    path: "/initial-setup",
    name: "initialSetup",
    component: InitialSetupView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
