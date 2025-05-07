<template>
  <div class="movie-detail">
    <v-container>
      <v-row>
        <v-col cols="12">
          <h1 class="text-h2 font-weight-bold mb-2">
            {{ movie?.title
            }}<span v-if="movie?.release_date">
              ({{ movie?.release_date?.slice(0, 4) }})</span
            >
          </h1>
          <div class="mb-4">
            <v-chip
              v-for="genre in movie?.genres || []"
              :key="genre.id"
              size="large"
              color="primary"
              variant="elevated"
              class="mr-2 mb-2"
            >
              {{ genre.name }}
            </v-chip>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="4" class="d-flex flex-column align-center">
          <v-img
            v-if="movie?.poster_path"
            :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
            :alt="movie.title"
            width="260"
            height="390"
            class="mb-2"
            rounded
          />
          <div class="rating-row mb-2">
            <v-rating
              v-if="movie?.vote_average"
              :model-value="movie.vote_average / 2"
              readonly
              half-increments
              color="amber"
              density="compact"
              size="large"
            />
            <span class="text-caption text-grey"
              >{{ movie?.vote_count }} votes</span
            >
          </div>
        </v-col>
        <v-col cols="12" md="8">
          <div
            v-if="movie?.tagline"
            style="font-style: italic"
            class="text-subtitle-1 mb-2"
          >
            {{ movie.tagline }}
          </div>
          <div class="mb-2">
            <span class="font-weight-bold">Résumé du film - </span>
            <span>{{ movie?.overview }}</span>
          </div>
          <div class="mb-2">
            <div v-if="movie?.homepage">
              <a
                :href="movie.homepage"
                target="_blank"
                class="text-primary text-decoration-underline"
                >Lien vers le site du film</a
              >
            </div>
            <div v-if="movie?.imdb_id">
              <a
                :href="`https://www.imdb.com/title/${movie.imdb_id}`"
                target="_blank"
                class="text-primary text-decoration-underline"
                >Lien vers la page IMDB du film</a
              >
            </div>
          </div>
          <div v-if="firstYoutubeVideo" class="mb-2">
            <div class="font-weight-bold mb-1">Vidéos</div>
            <div>
              <iframe
                width="360"
                height="200"
                :src="`https://www.youtube.com/embed/${firstYoutubeVideo.key}`"
                frameborder="0"
                allowfullscreen
                class="mb-2"
              ></iframe>
            </div>
          </div>
        </v-col>
      </v-row>
      <v-row v-if="castWithDirector.length">
        <v-col cols="12">
          <div class="font-weight-bold text-h5 mb-2">Crédits</div>
          <div class="cast-grid">
            <div
              v-for="person in paginatedCast"
              :key="person.id"
              class="cast-card"
            >
              <div class="cast-img-wrapper">
                <v-img
                  v-if="person.profile_path"
                  :src="`https://image.tmdb.org/t/p/w185${person.profile_path}`"
                  :alt="person.name"
                  width="100"
                  height="150"
                  class="mb-1 cast-image"
                  rounded
                />
                <div v-else class="placeholder-img mb-1">
                  <v-icon size="48" color="grey">mdi-account</v-icon>
                </div>
                <v-icon
                  v-if="person.job === 'Director'"
                  class="director-icon"
                  color="black"
                  size="28"
                  >mdi-movie-open</v-icon
                >
              </div>
              <div class="text-center text-caption font-weight-medium">
                {{ person.name }}
              </div>
            </div>
          </div>
          <div class="d-flex justify-center align-center mt-4">
            <v-btn
              icon
              :disabled="currentPage === 1"
              @click="currentPage--"
              class="mr-2"
            >
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <span class="text-caption"
              >{{ currentPage }} / {{ totalPages }}</span
            >
            <v-btn
              icon
              :disabled="currentPage === totalPages"
              @click="currentPage++"
              class="ml-2"
            >
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </div>
        </v-col>
      </v-row>
      <v-row v-if="loading">
        <v-col cols="12" class="text-center">
          <v-progress-circular indeterminate color="primary" size="48" />
        </v-col>
      </v-row>
      <v-row v-if="error">
        <v-col cols="12" class="text-center">
          <v-alert type="error">{{ error }}</v-alert>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const movie = ref<any>(null);
const loading = ref(true);
const error = ref(null);

const firstYoutubeVideo = computed(() => {
  if (!movie.value?.videos?.results) return null;
  return movie.value.videos.results.find((v: any) => v.site === "YouTube");
});

const director = computed(() => {
  if (!movie.value?.credits?.crew) return null;
  return movie.value.credits.crew.find(
    (person: any) => person.job === "Director"
  );
});

const castWithDirector = computed(() => {
  if (!movie.value?.credits?.cast) return [];
  const cast = movie.value.credits.cast;
  const dir = director.value;
  if (!dir) return cast;
  // Avoid duplicate if director is also in cast
  const filteredCast = cast.filter((person: any) => person.id !== dir.id);
  return [dir, ...filteredCast];
});

const currentPage = ref(1);
const itemsPerPage = 6;

const totalPages = computed(() =>
  Math.ceil(castWithDirector.value.length / itemsPerPage)
);

const paginatedCast = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return castWithDirector.value.slice(start, end);
});

onMounted(async () => {
  try {
    const response = await fetch(
      `http://localhost:3000/movies/${route.params.id}`
    );
    if (!response.ok) throw new Error("Failed to fetch movie details.");
    const data = await response.json();
    movie.value = data;
  } catch (e) {
    error.value = "Failed to fetch movie details.";
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.movie-detail {
  padding: 2rem 0;
}
.rating-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.cast-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}
.cast-card {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.cast-img-wrapper {
  position: relative;
  width: 100px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cast-image {
  border-radius: 8px;
  overflow: hidden;
}
.placeholder-img {
  width: 100px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
}
.director-icon {
  position: absolute;
  top: 6px;
  right: 6px;
  z-index: 2;
  background: white;
  padding: 0.75em;
  border-radius: 50%;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
}
</style>
