import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/letters",
    name: "Letters",
    component: () => import("../views/Letters.vue")
  },
  {
    path: "/numbers",
    name: "Numbers",
    component: () => import("../views/Numbers.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
