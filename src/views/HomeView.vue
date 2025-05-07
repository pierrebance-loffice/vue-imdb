<template>
  <div class="home">
    <v-container>
      <v-row class="align-center mb-4">
        <v-col cols="12" md="8">
          <h1 class="text-h4 font-weight-bold mb-4">Les plus populaires</h1>
        </v-col>
        <v-col cols="12" md="4" class="d-flex justify-end align-center">
          <div class="sort-view-group d-flex align-center" style="gap: 8px">
            <v-select
              v-model="sortBy"
              :items="sortOptions"
              label="Trier par"
              variant="outlined"
              hide-details
              density="compact"
              style="max-width: 220px"
            />
            <v-btn
              :icon="viewMode === 'grid' ? 'mdi-view-grid' : 'mdi-view-list'"
              @click="toggleViewMode"
              variant="tonal"
              color="primary"
              :aria-label="viewMode === 'grid' ? 'Grid view' : 'List view'"
            />
          </div>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-progress-circular
            v-if="moviesStore.loading"
            indeterminate
            color="primary"
            class="my-8 mx-auto d-block"
            size="48"
          />
          <v-alert v-if="moviesStore.error" type="error" class="mb-4">
            {{ moviesStore.error }}
          </v-alert>
        </v-col>
      </v-row>

      <div v-if="!moviesStore.loading && !moviesStore.error">
        <template v-if="viewMode === 'grid'">
          <div class="movie-grid">
            <MovieCard
              v-for="movie in paginatedMovies"
              :key="movie.id"
              :movie="movie"
              :genres="movie.genres"
            />
          </div>
        </template>
        <template v-else>
          <v-row>
            <v-col cols="12" v-for="movie in paginatedMovies" :key="movie.id">
              <MovieListItem :movie="movie" :genres="movie.genres" />
            </v-col>
          </v-row>
        </template>
      </div>

      <v-row>
        <v-col cols="12" class="d-flex justify-center">
          <v-pagination
            v-if="totalUiPages > 1"
            v-model="uiPage"
            :length="totalUiPages"
            :total-visible="7"
            @update:model-value="handleUiPageChange"
            class="mt-6"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from "vue";
import { useMoviesStore } from "@/stores/movies";
import MovieCard from "@/components/MovieCard.vue";
import MovieListItem from "@/components/MovieListItem.vue";

const moviesStore = useMoviesStore();
const viewMode = ref<"grid" | "list">("grid");
const sortBy = ref("popularity.desc");
const uiPage = ref(1); // UI page (10 items per page)
const API_PAGE_SIZE = 20;
const UI_PAGE_SIZE = 10;
// const MAX_UI_PAGES = 100; // No longer used

const sortOptions = [
  { title: "Du plus populaire au moins populaire", value: "popularity.desc" },
  { title: "Du moins populaire au plus populaire", value: "popularity.asc" },
  { title: "Titre A-Z", value: "title.asc" },
  { title: "Titre Z-A", value: "title.desc" },
];

function toggleViewMode() {
  viewMode.value = viewMode.value === "grid" ? "list" : "grid";
}

// Calculate total UI pages based on total results and UI page size (no cap)
const totalUiPages = computed(() =>
  Math.ceil(moviesStore.totalResults / UI_PAGE_SIZE)
);

// Calculate which API page to fetch based on UI page
const apiPage = computed(
  () => Math.floor(((uiPage.value - 1) * UI_PAGE_SIZE) / API_PAGE_SIZE) + 1
);

// Slice the movies for the current UI page
const paginatedMovies = computed(() => {
  const start =
    ((uiPage.value - 1) % (API_PAGE_SIZE / UI_PAGE_SIZE)) * UI_PAGE_SIZE;
  return moviesStore.movies.slice(start, start + UI_PAGE_SIZE);
});

function handleUiPageChange(page: number) {
  uiPage.value = page;
  // If the UI page maps to a different API page, fetch it
  if (apiPage.value !== moviesStore.currentPage) {
    moviesStore.fetchMovies(apiPage.value, sortBy.value);
  }
}

watch(sortBy, (newSort) => {
  uiPage.value = 1;
  moviesStore.fetchMovies(1, newSort);
});

// When API page changes, refetch if needed
watch(apiPage, (newApiPage) => {
  if (newApiPage !== moviesStore.currentPage) {
    moviesStore.fetchMovies(newApiPage, sortBy.value);
  }
});

onMounted(() => {
  moviesStore.fetchMovies(apiPage.value, sortBy.value);
});
</script>

<style scoped>
.home {
  min-height: calc(100vh - 64px);
  padding: 2rem 0;
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 24px;
}

@media (min-width: 960px) {
  .movie-grid {
    grid-template-columns: repeat(5, 220px);
    gap: 32px;
    justify-content: center;
  }
}
</style>
