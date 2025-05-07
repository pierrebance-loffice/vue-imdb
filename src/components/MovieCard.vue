<template>
  <router-link
    :to="`/movies/${movie.id}`"
    style="text-decoration: none; color: inherit"
  >
    <v-card class="movie-card h-100 light-bg" hover>
      <v-img
        :src="posterUrl"
        height="300"
        cover
        :alt="movie.title"
        class="mb-2"
      />
      <v-card-title class="font-bold">{{ movie.title }}</v-card-title>
      <v-card-text>
        <div class="mb-2 genre-chips">
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
      </v-card-text>
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
.movie-card {
  width: 220px;
  cursor: pointer;
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
