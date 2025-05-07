export interface Genre {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
  title: string;
  overview?: string;
  poster_path?: string;
  release_date?: string;
  vote_average?: number;
  vote_count?: number;
  genres: Genre[];
  tagline?: string;
  homepage?: string;
  imdb_id?: string;
  videos?: {
    results: Array<{
      key: string;
      site: string;
      type?: string;
    }>;
  };
  credits?: {
    cast: Person[];
    crew: Person[];
  };
}

export interface Person {
  id: number;
  name: string;
  biography?: string;
  birthday?: string;
  place_of_birth?: string;
  profile_path?: string;
  known_for_department?: string;
  imdb_id?: string;
  images?: Array<{
    file_path: string;
  }>;
  movie_credits?: {
    cast: Array<{
      id: number;
      title?: string;
      name?: string;
      poster_path?: string;
    }>;
    crew: Array<{
      id: number;
      title?: string;
      name?: string;
      poster_path?: string;
      job?: string;
    }>;
  };
  job?: string;
}
