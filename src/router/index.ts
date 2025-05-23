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
      path: "/movies/:movieId",
      name: "movie-detail",
      component: () => import("../views/MovieDetailView.vue"),
      props: true,
      children: [
        {
          path: "people/:personId",
          name: "person-modal",
          props: true,
          component: { render: () => null },
        },
      ],
    },
    {
      path: "/people/:personId",
      name: "people-detail",
      component: () => import("../views/PeopleDetailView.vue"),
      props: true,
      children: [
        {
          path: "movies/:movieId",
          name: "movie-modal",
          props: true,
          component: { render: () => null },
        },
      ],
    },
  ],
});

export default router;
