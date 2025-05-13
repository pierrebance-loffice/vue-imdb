import { API_BASE_URL, DEFAULT_PAGE, DEFAULT_SORT_BY } from "@/constants";
import type { Movie } from "@/types";

export type { Movie };

export interface DiscoverMoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export async function discoverMovies(
  page = DEFAULT_PAGE,
  sortBy = DEFAULT_SORT_BY,
): Promise<DiscoverMoviesResponse> {
  const response = await fetch(
    `${API_BASE_URL}/movies/discover?page=${page}&sort_by=${sortBy}`,
  );
  if (!response.ok) throw new Error("Failed to fetch movies");
  return response.json();
}
