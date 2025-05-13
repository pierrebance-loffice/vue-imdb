<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12">
          <h1 class="text-h2 font-weight-bold mb-2">
            {{ person?.name }}
            <v-chip
              v-if="person?.known_for_department"
              size="large"
              color="primary"
              variant="elevated"
              class="ml-2"
            >
              {{ person.known_for_department }}
            </v-chip>
          </h1>
        </v-col>
      </v-row>
      <v-row>
        <div>
          <v-img
            v-if="person?.profile_path"
            :src="`${IMAGE_BASE_URL_SMALL}${person.profile_path}`"
            :alt="person.name"
            width="200"
            height="300"
            class="mb-2 align-start image"
            rounded
            cover
          />
          <div v-else class="image-placeholder mb-1">
            <v-icon size="48" color="grey">mdi-account</v-icon>
          </div>
        </div>
        <v-col>
          <div class="mb-4 font-italic">
            <span v-if="person?.birthday">{{
              new Date(person.birthday).toLocaleString("fr-FR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            }}</span>
            <span v-if="person?.place_of_birth"
              >, {{ person.place_of_birth }}</span
            >
          </div>
          <div v-if="person?.biography" class="mb-2">
            <span class="font-weight-bold">Biographie - </span>
            <span>{{ person?.biography }}</span>
          </div>
          <div v-if="person?.imdb_id">
            <a
              :href="`https://www.imdb.com/name/${person.imdb_id}`"
              target="_blank"
              class="text-primary text-decoration-underline"
              >Lien vers la page IMDB de la personne</a
            >
          </div>
          <v-row v-if="person?.images?.length && !props.compact" class="mt-4">
            <v-col cols="12">
              <h3 class="text-h5 mb-2">Profile pictures</h3>
              <div class="pics">
                <div
                  v-for="picture in pictures"
                  :key="picture.file_path"
                  class="pics-card"
                >
                  <div class="pics-img-wrapper">
                    <v-img
                      v-if="picture.file_path"
                      :src="`${IMAGE_BASE_URL_SMALL}${picture.file_path}`"
                      width="100"
                      height="150"
                      class="mb-1 pics-image"
                      rounded
                      cover
                    />
                    <div v-else class="pics-placeholder mb-1">
                      <v-icon size="48" color="grey">mdi-image-album</v-icon>
                    </div>
                  </div>
                </div>
              </div>
              <div
                v-if="totalProfilePages > 1"
                class="d-flex justify-center align-center mt-4"
              >
                <v-btn
                  icon
                  :disabled="currentProfilePage === 1"
                  class="mr-2"
                  @click="currentProfilePage--"
                >
                  <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
                <span class="text-caption">
                  {{ currentProfilePage }} / {{ totalProfilePages }}
                </span>
                <v-btn
                  icon
                  :disabled="currentProfilePage === totalProfilePages"
                  class="ml-2"
                  @click="currentProfilePage++"
                >
                  <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row v-if="person?.movie_credits?.cast?.length && !props.compact">
        <v-col cols="12">
          <div class="font-weight-bold text-h5 mb-2">Crédits</div>
          <div class="credits">
            <div
              v-for="movie in paginatedCredits"
              :key="movie.id"
              class="credits-card"
              style=""
              @click="openMovieModal(movie.id)"
            >
              <div class="credits-img-wrapper">
                <v-img
                  v-if="movie.poster_path"
                  :src="`${IMAGE_BASE_URL_SMALL}${movie.poster_path}`"
                  :alt="movie.title || movie.name"
                  width="100"
                  height="150"
                  class="mb-1 credits-image"
                  rounded
                  cover
                />
                <div v-else class="credits-placeholder mb-1">
                  <v-icon size="48" color="grey">mdi-movie</v-icon>
                </div>
              </div>

              <div
                class="text-center text-caption font-weight-medium credits-text"
              >
                {{ movie.title || movie.name }}
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
            <span class="text-caption">
              {{ currentPage }} / {{ totalPages }}
            </span>
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
      :dialog="showMovieModal"
      :navigate-to="`/movies/${movieId}`"
      :navigate-label="`Lien vers la page du film`"
      @close="closeMovieModal"
      @navigate="(path: string) => router.push(path)"
    >
      <MovieDetailView
        v-if="movieId"
        :id="movieId"
        :key="movieId"
        compact
        @close="closeMovieModal"
      />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { IMAGE_BASE_URL_SMALL } from "@/constants";
import { Person } from "@/types";
import { computed, defineProps, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Modal from "../components/Modal.vue";
import MovieDetailView from "./MovieDetailView.vue";

const route = useRoute();
const router = useRouter();
const person = ref<Person | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

const currentProfilePage = ref(1);
const profilesPerPage = 6;

const totalProfilePages = computed(() => {
  return person.value?.images
    ? Math.ceil(person.value.images.length / profilesPerPage)
    : 1;
});

const pictures = computed(() => {
  if (!person.value?.images) return [];
  const start = (currentProfilePage.value - 1) * profilesPerPage;
  return person.value.images.slice(start, start + profilesPerPage);
});

const currentPage = ref(1);
const itemsPerPage = 6;

const totalPages = computed(() =>
  person.value?.movie_credits?.cast
    ? Math.ceil(person.value.movie_credits.cast.length / itemsPerPage)
    : 1,
);

const paginatedCredits = computed(() => {
  if (!person.value?.movie_credits?.cast) return [];
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return person.value.movie_credits.cast.slice(start, end);
});

const showMovieModal = ref(false);
const movieId = ref<string | null>(null);

function openMovieModal(id: number) {
  router.push({
    name: "movie-modal",
    params: { id: route.params.personId, movieId: id },
  });
}

const closeMovieModal = () => {
  showMovieModal.value = false;
  movieId.value = null;
  router.replace({ name: "people-detail", params: { id: route.params.id } });
};

watch(
  () => route.fullPath,
  () => {
    const match = route.name === "movie-modal" && route.params.movieId;
    if (match) {
      movieId.value = route.params.movieId as string;
      showMovieModal.value = true;
    } else {
      showMovieModal.value = false;
      movieId.value = null;
    }
  },
  { immediate: true },
);

onMounted(async () => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/v1/people/${route.params.personId}`,
    );
    if (!response.ok) throw new Error("Failed to fetch person details.");
    const data = await response.json();
    person.value = data;
  } catch {
    error.value = "Failed to fetch person details.";
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
.image {
  width: 200px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
}
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
.pics {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
  margin-left: auto;
  margin-right: auto;
}
.pics-card {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.pics-img-wrapper {
  position: relative;
  width: 100px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.pics-image {
  border-radius: 8px;
  width: 100px;
  height: 150px;
}
.pics-placeholder {
  width: 100px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
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
</style>
