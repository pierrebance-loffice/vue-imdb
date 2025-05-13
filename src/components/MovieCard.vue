<template>
  <router-link
    :to="`/movies/${movie.id}`"
    style="text-decoration: none; color: inherit"
  >
    <v-card class="movie-card h-100 light-bg" hover>
      <v-img
        :src="posterUrl"
        height="300"
        width="200"
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
        <div v-if="movie.vote_average" class="rating-row">
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
import { DEFAULT_POSTER_PATH, IMAGE_BASE_URL } from "@/constants";
import type { Movie } from "@/types";
import { computed } from "vue";

/**
 * MovieCard Component
 *
 * A reusable card component that displays movie information in a visually appealing format.
 * The card includes a poster image, title, genres, and rating information.
 *
 * @component
 * @example
 * ```vue
 * <MovieCard :movie="movieData" />
 * ```
 */
const props = defineProps<{
  /** The movie data to display in the card */
  movie: Movie;
}>();

/**
 * Computed property that generates the poster image URL.
 * Falls back to a default poster image if no poster path is available.
 *
 * @computed
 * @returns {string} The complete URL for the movie poster
 */
const posterUrl = computed(() =>
  props.movie.poster_path
    ? `${IMAGE_BASE_URL}${props.movie.poster_path}`
    : DEFAULT_POSTER_PATH,
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
  background-color: var(--v-theme-background, #f7f7f9);
}
:deep(.v-theme--light) .light-bg {
  background-color: #f7f7f9 !important;
}
:deep(.v-theme--dark) .light-bg {
  background-color: inherit !important;
}
</style>
