import { useState } from "react";
import DetailMovies from "./detailMovies";

type MovieItem = {
  _id: string;
  name?: string;
  decripstion?: string;
  type?: string;
  genres?: string[];
  poster?: string;
  backdoor?: string;
  country?: string;
  release_date?: string;
  createdAt?: string;
  updatedAt?: string;
};

type MoviesResponse = {
  page: number;
  total_page: number;
  movies: MovieItem[];
};

type ListMoviesProps = {
  data: MoviesResponse | null;
  loading: boolean;
  error: string | null;
  isDetail: boolean;
  setDetail: (value: boolean) => void;
};

const ListMovies = ({
  data,
  loading,
  error,
  isDetail,
  setDetail,
}: ListMoviesProps) => {
  const [value, setValue] = useState<any>([]);

  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

  const getImageUrl = (path?: string) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${baseUrl}${path}`;
  };

  if (loading) {
    return <div className="p-6 text-white/70">Đang tải...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-300">{error}</div>;
  }

  if (!data) {
    return <div className="p-6 text-white/70">Chưa có phim nào.</div>;
  }

  return (
    <div className=" w-full h-full p-4 content-center">
      <div className={`w-full h-full  z-10 ${isDetail ? "" : "hidden"}`}>
        <DetailMovies
          detailmovie={value}
          isDetail={isDetail}
          setDetail={setDetail}
        />
      </div>
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-8 gap-6 ${isDetail ? "hidden" : ""}`}
      >
        {data.movies.map((movie) => {
          const posterUrl = getImageUrl(movie.poster);
          return (
            <div
              key={movie._id}
              className="rounded-2xl border border-white/10 bg-white/0.03 overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
            >
              <div
                onClick={() => {
                  setDetail(!isDetail);
                  setValue(movie);
                }}
                className="relative aspect-2/3 bg-linear-to-br from-[#2b2b35] via-[#1f1f2a] to-[#1a1a22]"
              >
                {posterUrl ? (
                  <img
                    src={posterUrl}
                    alt={movie.name || "movie"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full grid place-items-center text-white/40 text-sm">
                    No poster
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white font-semibold text-sm line-clamp-2 capitalize">
                    {movie.name || "Không tên"}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListMovies;
