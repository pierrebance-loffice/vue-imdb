import { DEFAULT_PAGE, DEFAULT_SORT_BY } from "@/constants";
import { discoverMovies, type Movie } from "@/services/api";
import { defineStore } from "pinia";

interface MoviesState {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalResults: number;
}

export const useMoviesStore = defineStore("movies", {
  state: (): MoviesState => ({
    movies: [],
    loading: false,
    error: null,
    currentPage: DEFAULT_PAGE,
    totalPages: 0,
    totalResults: 0,
  }),

  actions: {
    async fetchMovies(page = DEFAULT_PAGE, sortBy = DEFAULT_SORT_BY) {
      this.loading = true;
      this.error = null;
      try {
        const response = await discoverMovies(page, sortBy);
        this.movies = response.results;
        this.currentPage = response.page;
        this.totalPages = response.total_pages;
        this.totalResults = response.total_results;
      } catch (error) {
        this.error = "Failed to fetch movies";
        console.error("Error fetching movies:", error);
      } finally {
        this.loading = false;
      }
    },
  },
});
