import type { Movie } from "@/types";
export type { Movie };

export interface DiscoverMoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export async function discoverMovies(
  page = 1,
  sortBy = "popularity.desc"
): Promise<DiscoverMoviesResponse> {
  const response = await fetch(
    `http://localhost:3000/discover/movies?page=${page}&sort_by=${sortBy}`
  );
  if (!response.ok) throw new Error("Failed to fetch movies");
  return response.json();
}
