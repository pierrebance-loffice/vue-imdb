import MovieCard from "@/components/MovieCard.vue";
import { IMAGE_BASE_URL } from "@/constants";
import { render, screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";

const mockMovie = {
  id: 1,
  title: "Test Movie",
  overview: "Test overview",
  poster_path: "/test-poster.jpg",
  release_date: "2024-03-20",
  vote_average: 8.5,
  vote_count: 1000,
  genres: [
    { id: 1, name: "Action" },
    { id: 2, name: "Drama" },
  ],
};

describe("MovieCard", () => {
  it("renders movie title correctly", () => {
    render(MovieCard, {
      props: {
        movie: mockMovie,
      },
    });

    expect(screen.getByText("Test Movie")).toBeInTheDocument();
  });

  it("renders movie genres correctly", () => {
    render(MovieCard, {
      props: {
        movie: mockMovie,
      },
    });

    expect(screen.getByText("Action")).toBeInTheDocument();
    expect(screen.getByText("Drama")).toBeInTheDocument();
  });

  it("renders movie rating correctly", () => {
    render(MovieCard, {
      props: {
        movie: mockMovie,
      },
    });

    expect(screen.getByText("1000 votes")).toBeInTheDocument();
  });

  it("uses correct poster URL", () => {
    render(MovieCard, {
      props: {
        movie: mockMovie,
      },
    });

    const poster = screen.getByAltText("Test Movie");
    expect(poster).toHaveAttribute("src", `${IMAGE_BASE_URL}/test-poster.jpg`);
  });

  it("uses default poster when no poster_path is provided", () => {
    const movieWithoutPoster = { ...mockMovie, poster_path: undefined };

    render(MovieCard, {
      props: {
        movie: movieWithoutPoster,
      },
    });

    const poster = screen.getByAltText("Test Movie");
    expect(poster).toHaveAttribute("src", "/placeholder.png");
  });
});
