import { apiGet, apiPost } from "./http";

import type {
  MoviesResponse,
  GenresResponse,
  EpisodesResponse,
  MoviesSlideResponse,
} from "../types";

export const get_movies = (page = 1) =>
  apiGet<MoviesResponse>(`/movies?page=${page}`);

export const search_movies = (query: string) =>
  apiGet<{ movies: MoviesResponse["movies"] }>(
    `/movies/search?q=${encodeURIComponent(query)}`,
  );

export const movies_top = () => apiGet<MoviesResponse>(`/movies_top`);

export const movies_slide = () => apiGet<MoviesSlideResponse>(`/movies_slide`);

export const get_movies_by_genre = (genreId: string, page = 1) =>
  apiGet<MoviesResponse>(`/movies/genres/${genreId}?page=${page}`);

export const get_movies_by_type = (type: string, page = 1) =>
  apiGet<MoviesResponse>(`/movies/type/${type}?page=${page}`);

export const get_movies_by_country = (country: string, page = 1) =>
  apiGet<MoviesResponse>(`/movies/country/${country}?page=${page}`);

// Episodes API
export const get_episodes = (movieId: string) =>
  apiGet<EpisodesResponse>(`/manage/episodes/${movieId}`);

export const post_episode = (data: {
  title: string;
  resources: string;
  from: string;
}) => apiPost<{ message: string }>(`/manage/episode`, data);

// Genres API
export const get_all_genres = () => apiGet<GenresResponse>(`/genres`);

export const get_genre_by_id = (genreId: string) =>
  apiGet<{ genre: { _id: string; name: string } }>(`/genres/${genreId}`);
