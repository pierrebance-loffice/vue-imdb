<template>
  <router-link
    :to="`/movies/${movie.id}`"
    style="text-decoration: none; color: inherit"
  >
    <v-card
      class="movie-list-item flex flex-row items-center mb-2 light-bg"
      hover
    >
      <div class="movie-list-img-wrapper mr-4">
        <v-img
          :src="posterUrl"
          cover
          :alt="movie.title"
          class="movie-list-img"
        />
      </div>
      <div
        class="movie-list-content flex-1 flex flex-col justify-center min-w-0"
      >
        <h3 class="font-bold mb-1 text-truncate">
          {{ movie.title }}
        </h3>
        <div class="mb-1 genre-chips">
          <v-chip
            v-for="genre in movie.genres"
            :key="genre.id"
            size="small"
            color="primary"
            variant="elevated"
          >
            {{ genre.name }}
          </v-chip>
        </div>
        <div class="rating-row">
          <v-rating
            :model-value="movie.vote_average / 2"
            readonly
            half-increments
            color="amber"
            density="compact"
            size="small"
          />
          <span class="text-xs text-gray-500"
            >{{ movie.vote_count }} votes</span
          >
        </div>
      </div>
    </v-card>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Movie } from "@/types";

const props = defineProps<{
  movie: Movie;
}>();

const posterUrl = computed(() =>
  props.movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${props.movie.poster_path}`
    : "/placeholder.png"
);
</script>

<style scoped>
.movie-list-item {
  max-width: 100%;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.movie-list-img-wrapper {
  width: 70px;
  height: 100px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.movie-list-img {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover;
  border-radius: 6px;
}
.movie-list-content {
  min-width: 0;
}
.genre-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.rating-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.light-bg {
  background-color: #f7f7f9;
}
:deep(.v-theme--light) .light-bg {
  background-color: #f7f7f9 !important;
}
:deep(.v-theme--dark) .light-bg {
  background-color: inherit !important;
}
</style>
