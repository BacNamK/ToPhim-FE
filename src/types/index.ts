// Movie Item từ Backend
export type MovieItem = {
  _id: string;
  name?: string;
  decripstion?: string;
  slug?: string;
  type?: "single" | "series" | "tvshow" | "movie";
  genres?: string[]; // Array of genre IDs or names
  poster?: string;
  backdoor?: string;
  country?: string;
  release_date?: string;
  createdAt?: string;
  updatedAt?: string;
};

// Episode Item
export type EpisodeItem = {
  _id: string;
  title: string;
  resources: string;
  from: string; // movieId
  createdAt?: string;
  updatedAt?: string;
};

// Genre Item
export type GenreItem = {
  id: string;
  name: string;
};

// API Response cho movies
export type MoviesResponse = {
  page: number;
  total_page: number;
  movies: MovieItem[];
};

// API Response cho movies slide
export type MoviesSlideResponse = {
  movies: {
    single?: MovieItem[];
    series?: MovieItem[];
    movie?: MovieItem[];
    tvshow?: MovieItem[];
  };
};

// API Response cho genres
export type GenresResponse = {
  genres: GenreItem[];
};

// API Response cho episodes
export type EpisodesResponse = {
  episodes: EpisodeItem[];
};

// User Item từ Backend
export type UserItem = {
  _id: string;
  username: string;
  email: string;
  role: boolean;
  createdAt: string;
};

// API Response cho users
export type UsersResponse = {
  page: number;
  total_page: number;
  users: UserItem[];
};
