<template>
  <v-app>
    <v-app-bar>
      <v-app-bar-title>
        <router-link to="/" style="text-decoration: none; color: inherit">
          My IMDB
        </router-link>
      </v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn
        :icon="isDark ? 'mdi-weather-night' : 'mdi-white-balance-sunny'"
        variant="text"
        :aria-label="
          isDark ? 'Activer le mode clair' : 'Activer le mode sombre'
        "
        @click="toggleTheme"
      />
    </v-app-bar>

    <v-main>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useTheme } from "vuetify";

const theme = useTheme();
const isDark = ref(theme.global.current.value.dark);

function toggleTheme() {
  isDark.value = !isDark.value;
  theme.global.name.value = isDark.value ? "dark" : "light";
}

watch(
  () => theme.global.current.value.dark,
  (val) => {
    isDark.value = val;
  },
);
</script>
