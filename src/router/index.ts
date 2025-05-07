import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory("/"),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/movies/:id",
      name: "movie-detail",
      component: () => import("../views/MovieDetailView.vue"),
      props: true,
    },
    {
      path: "/people/:id",
      name: "people-detail",
      component: () => import("../views/PeopleDetailView.vue"),
      props: true,
    },
  ],
});

export default router;
