<template>
  <div class="person-detail">
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
        <v-img
          v-if="person?.profile_path"
          :src="`https://image.tmdb.org/t/p/w500${person.profile_path}`"
          :alt="person.name"
          width="200"
          height="300"
          class="mb-2 align-start"
          rounded
        />

        <v-col cols="12" md="8">
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
          <div class="mb-2">
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
          <div v-if="person?.homepage">
            <a
              :href="person.homepage"
              target="_blank"
              class="text-primary text-decoration-underline"
              >Lien vers la page de la personne</a
            >
          </div>
          <v-row v-if="person?.images?.profiles?.length" class="mt-4">
            <v-col cols="12">
              <h3 class="text-h5 mb-2">Profile pictures</h3>
              <div class="cast-grid">
                <v-img
                  v-for="(img, idx) in paginatedProfiles"
                  :key="idx"
                  :src="`https://image.tmdb.org/t/p/w300${img.file_path}`"
                  width="100"
                  height="150"
                  class="mr-2 mb-2"
                  rounded
                />
              </div>
              <div class="d-flex justify-center align-center mt-4">
                <v-btn
                  icon
                  :disabled="currentProfilePage === 1"
                  @click="currentProfilePage--"
                  class="mr-2"
                >
                  <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
                <span class="text-caption">
                  {{ currentProfilePage }} / {{ totalProfilePages }}
                </span>
                <v-btn
                  icon
                  :disabled="currentProfilePage === totalProfilePages"
                  @click="currentProfilePage++"
                  class="ml-2"
                >
                  <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row v-if="person?.movie_credits?.cast?.length">
        <v-col cols="12">
          <div class="font-weight-bold text-h5 mb-2">Crédits</div>
          <div
            class="cast-grid"
            style="
              display: grid;
              grid-template-columns: repeat(8, 1fr);
              grid-template-rows: repeat(2, 1fr);
              gap: 1rem;
            "
          >
            <div
              v-for="credit in paginatedCredits"
              :key="credit.id"
              class="cast-card"
            >
              <v-img
                v-if="credit.poster_path"
                :src="`https://image.tmdb.org/t/p/w185${credit.poster_path}`"
                :alt="credit.title || credit.name"
                width="100"
                height="150"
                class="mb-1 cast-image"
                rounded
              />
              <div class="text-center text-caption font-weight-medium">
                {{ credit.title || credit.name }}
              </div>
            </div>
          </div>
          <div class="d-flex justify-center align-center mt-4">
            <v-btn
              icon
              :disabled="currentCreditPage === 1"
              @click="currentCreditPage--"
              class="mr-2"
            >
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <span class="text-caption">
              {{ currentCreditPage }} / {{ totalCreditPages }}
            </span>
            <v-btn
              icon
              :disabled="currentCreditPage === totalCreditPages"
              @click="currentCreditPage++"
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
const person = ref<any>(null);
const loading = ref(true);
const error = ref(null);

const currentProfilePage = ref(1);
const profilesPerPage = 6;

const totalProfilePages = computed(() =>
  person.value?.images?.profiles
    ? Math.ceil(person.value.images.profiles.length / profilesPerPage)
    : 1
);

const paginatedProfiles = computed(() => {
  if (!person.value?.images?.profiles) return [];
  const start = (currentProfilePage.value - 1) * profilesPerPage;
  return person.value.images.profiles.slice(start, start + profilesPerPage);
});

// Credits pagination
const currentCreditPage = ref(1);
const creditsPerPage = 16;

const totalCreditPages = computed(() =>
  person.value?.movie_credits?.cast
    ? Math.ceil(person.value.movie_credits.cast.length / creditsPerPage)
    : 1
);

const paginatedCredits = computed(() => {
  if (!person.value?.movie_credits?.cast) return [];
  const start = (currentCreditPage.value - 1) * creditsPerPage;
  return person.value.movie_credits.cast.slice(start, start + creditsPerPage);
});

onMounted(async () => {
  try {
    const response = await fetch(
      `http://localhost:3000/people/${route.params.id}`
    );
    if (!response.ok) throw new Error("Failed to fetch person details.");
    const data = await response.json();
    person.value = data;
    console.log("person.value.movie_credits");
    console.log(person.value.movie_credits.cast[0]);
  } catch (e) {
    error.value = "Failed to fetch person details.";
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.person-detail {
  padding: 2rem 0;
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
.cast-image {
  border-radius: 8px;
  overflow: hidden;
}
</style>
