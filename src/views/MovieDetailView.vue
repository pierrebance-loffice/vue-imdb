<template>
  <div>
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
        <div>
          <v-img
            v-if="movie?.poster_path"
            :src="`${IMAGE_BASE_URL}${movie.poster_path}`"
            :alt="movie.title"
            width="200"
            height="300"
            class="mb-2"
            rounded
            cover
          />
          <div v-else class="image-placeholder mb-1">
            <v-icon size="48" color="grey">mdi-movie</v-icon>
          </div>
          <div v-if="movie?.vote_count" class="rating-row mb-2">
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
        </div>
        <v-col cols="12" md="8">
          <div
            v-if="movie?.tagline"
            style="font-style: italic"
            class="text-subtitle-1 mb-2"
          >
            {{ movie.tagline }}
          </div>
          <div v-if="movie?.overview" class="mb-2">
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
      <v-row v-if="castWithDirector.length && !props.compact">
        <v-col cols="12">
          <div class="font-weight-bold text-h5 mb-2">Crédits</div>
          <div class="credits">
            <div
              v-for="person in paginatedCredits"
              :key="person.id"
              class="credits-card"
              @click="openPersonModal(person.id)"
            >
              <div class="credits-img-wrapper">
                <v-img
                  v-if="person.profile_path"
                  :src="`${IMAGE_BASE_URL_SMALL}${person.profile_path}`"
                  :alt="person.name"
                  width="100"
                  height="150"
                  class="credits-image"
                  rounded
                  cover
                />
                <div v-else class="credits-placeholder mb-1">
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
              <div
                class="text-center text-caption font-weight-medium credits-text"
              >
                {{ person.name }}
              </div>
            </div>
          </div>
          <div
            v-if="totalPages > 1"
            class="d-flex justify-center align-center mt-4"
          >
            <v-btn
              icon
              :disabled="currentPage === 1"
              class="mr-2"
              @click="currentPage--"
            >
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <span class="text-caption"
              >{{ currentPage }} / {{ totalPages }}</span
            >
            <v-btn
              icon
              :disabled="currentPage === totalPages"
              class="ml-2"
              @click="currentPage++"
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
    <Modal
      :dialog="showPersonModal"
      :navigate-to="`/people/${personId}`"
      :navigate-label="`Lien vers la page de la personne`"
      @close="closePersonModal"
      @navigate="(path) => router.push(path)"
    >
      <PeopleDetailView
        v-if="personId"
        :id="personId"
        :key="personId"
        compact
        @close="closePersonModal"
      />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { IMAGE_BASE_URL, IMAGE_BASE_URL_SMALL } from "@/constants";
import { Movie } from "@/types";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Modal from "../components/Modal.vue";
import PeopleDetailView from "./PeopleDetailView.vue";

const route = useRoute();
const router = useRouter();
const movie = ref<Movie | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

const firstYoutubeVideo = computed(() => {
  if (!movie.value?.videos?.results) return null;
  return movie.value.videos.results.find(({ site }) => site === "YouTube");
});

const director = computed(() => {
  if (!movie.value?.credits?.crew) return null;
  return movie.value.credits.crew.find(({ job }) => job === "Director");
});

const castWithDirector = computed(() => {
  if (!movie.value?.credits?.cast) return [];
  const cast = movie.value.credits.cast;
  const dir = director.value;
  if (!dir) return cast;
  const filteredCast = cast.filter(({ id }) => id !== dir.id);
  return [dir, ...filteredCast];
});

const currentPage = ref(1);
const itemsPerPage = 6;

const totalPages = computed(() =>
  castWithDirector.value.length > 0
    ? Math.ceil(castWithDirector.value.length / itemsPerPage)
    : 1,
);

const paginatedCredits = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return castWithDirector.value.slice(start, end);
});

const showPersonModal = ref(false);
const personId = ref<string | null>(null);

function openPersonModal(id: number) {
  router.push({
    name: "person-modal",
    params: { id: route.params.movieId, personId: id },
  });
}

function closePersonModal() {
  showPersonModal.value = false;
  personId.value = null;
  router.replace({ name: "movie-detail", params: { id: route.params.id } });
}

watch(
  () => route.fullPath,
  () => {
    const match = route.name === "person-modal" && route.params.personId;
    if (match) {
      personId.value = route.params.personId as string;
      showPersonModal.value = true;
    } else {
      showPersonModal.value = false;
      personId.value = null;
    }
  },
  { immediate: true },
);

onMounted(async () => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/movies/${route.params.movieId}`,
    );
    if (!response.ok) throw new Error("Failed to fetch movie details.");
    const data = await response.json();
    movie.value = data;
  } catch {
    error.value = "Failed to fetch movie details.";
  } finally {
    loading.value = false;
  }
});

const props = defineProps({
  id: {
    type: [String, Number],
    default: null,
  },
  compact: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
.image-placeholder {
  width: 200px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
}
.rating-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.credits {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
  margin-left: auto;
  margin-right: auto;
}
.credits-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}
.credits-img-wrapper {
  position: relative;
  width: 100px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.credits-image {
  border-radius: 8px;
  width: 100px;
  height: 150px;
}
.credits-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100px;
}
.credits-placeholder {
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
