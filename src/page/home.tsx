import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { movies_slide, movies_top } from "../api/movies";
import type { MovieItem } from "../types";

const MovieCard = ({
  movie,
  getImageUrl,
}: {
  movie: MovieItem;
  getImageUrl: (p?: string) => string;
}) => {
  return (
    <Link
      to={`/movie/${movie.slug || movie._id}`}
      state={{ movie }}
      className="group relative aspect-2/3 h-full shrink-0 overflow-hidden rounded-2xl bg-slate-900 transition-all duration-300 hover:scale-105 hover:z-10 shadow-xl"
    >
      <img
        src={getImageUrl(movie.poster)}
        alt={movie.name}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-end p-4">
        <p className="text-sm font-bold text-white line-clamp-2 leading-tight uppercase">
          {movie.name}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-[10px] font-bold text-amber-400 px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20">
            {movie.country || "N/A"}
          </span>
          <span className="text-[10px] text-white/60">
            {movie.release_date
              ? new Date(movie.release_date).getFullYear()
              : "2024"}
          </span>
        </div>
      </div>
    </Link>
  );
};

const CategoryRow = ({
  title,
  items,
  getImageUrl,
}: {
  title: string;
  items: MovieItem[];
  getImageUrl: (p?: string) => string;
}) => {
  return (
    <div className="w-full h-72 flex gap-4 bg-white/5 border border-white/10 rounded-4xl p-3 backdrop-blur-sm shadow-2xl">
      <div className="w-60 h-full bg-amber-400/10 rounded-2xl flex items-center justify-center border border-amber-400/5">
        <h2 className=" text-3xl font-black text-amber-300 ">{title}</h2>
      </div>
      <div className="flex flex-1 gap-5 overflow-x-auto custom-scrollbar pb-1 px-2">
        {items.length > 0 ? (
          items
            .slice(0, 5)
            .map((movie) => (
              <MovieCard
                key={movie._id}
                movie={movie}
                getImageUrl={getImageUrl}
              />
            ))
        ) : (
          <div className="flex-1 flex items-center justify-center text-white/20 italic text-sm">
            Chưa có phim ở mục này
          </div>
        )}
      </div>
    </div>
  );
};

const Home = () => {
  const [movies, setMovies] = useState<MovieItem[]>([]);

  const [value, setValue] = useState<{
    single?: MovieItem[];
    series?: MovieItem[];
    movie?: MovieItem[];
    tvshow?: MovieItem[];
  }>({});
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

  const getImageUrl = (path?: string) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${baseUrl}${path}`;
  };

  useEffect(() => {
    const fetchMovies = async () => {
      const response = await movies_slide();
      if (response?.data?.movies) {
        setValue(response.data.movies);
      }
    };
    fetchMovies();
  }, []);

  useEffect(() => {
    let isActive = true;

    const fetchTopMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await movies_top();
        if (!isActive) return;

        setMovies(response.data.movies || []);
        setActiveIndex(0);
      } catch (e) {
        if (!isActive) return;
        setError("Không thể tải dữ liệu phim.");
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchTopMovies();
    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!movies.length) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % movies.length);
    }, 7000);

    return () => {
      window.clearInterval(interval);
    };
  }, [movies]);

  const currentMovie = movies[activeIndex];
  const posterUrl = currentMovie?.backdoor || currentMovie?.poster || "";

  return (
    <div className="w-full h-full p-4 overflow-y-auto custom-scrollbar">
      <div className="mx-auto flex max-w-362.5 flex-col gap-6">
        <div className="relative overflow-hidden rounded-[36px] bg-slate-950/90 shadow-[0_30px_80px_rgba(15,23,42,0.35)]">
          {loading ? (
            <div className="flex min-h-130 items-center justify-center px-6 py-20 text-white/80">
              Đang tải nội dung slide...
            </div>
          ) : error ? (
            <div className="flex min-h-130 items-center justify-center px-6 py-20 text-red-300">
              {error}
            </div>
          ) : movies.length === 0 ? (
            <div className="flex min-h-130 items-center justify-center px-6 py-20 text-white/80">
              Chưa có dữ liệu phim để hiển thị.
            </div>
          ) : (
            <div className="relative min-h-130 bg-slate-950 text-white">
              <div className="absolute inset-0">
                <img
                  src={getImageUrl(posterUrl)}
                  alt={currentMovie?.name || "Slide phim"}
                  className="h-full w-full object-cover blur-[0.5px] brightness-90"
                />
                <div className="absolute inset-0 bg-linear-to-r from-slate-950/95 via-slate-950/70 to-transparent" />
              </div>

              <div className="relative z-10 w-1/2  h-full flex-col justify-end inset-8 sm:p-12">
                <div className="w-full space-y-4">
                  <span className="inline-flex rounded-full bg-amber-400/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-amber-300">
                    Phim nổi bật
                  </span>
                  <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl capitalize">
                    {currentMovie?.name || "Tên phim chưa cập nhật"}
                  </h1>
                  <p
                    className="max-w-2xl text-sm leading-7 text-slate-200/90 sm:text-base line-clamp-5
                  5 capitalize "
                  >
                    {currentMovie?.decripstion ||
                      currentMovie?.slug ||
                      "Mô tả tóm tắt sẽ được hiển thị tại đây."}
                  </p>
                </div>
              </div>

              <button
                type="button"
                aria-label="Phim trước"
                onClick={() =>
                  setActiveIndex(
                    (index) => (index - 1 + movies.length) % movies.length,
                  )
                }
                className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-slate-950/70 p-3 text-white transition hover:bg-slate-900/90 sm:left-6"
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="Phim tiếp theo"
                onClick={() =>
                  setActiveIndex((index) => (index + 1) % movies.length)
                }
                className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-slate-950/70 p-3 text-white transition hover:bg-slate-900/90 sm:right-6"
              >
                ›
              </button>

              <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
                {movies.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    aria-label={`Chuyển đến slide ${idx + 1}`}
                    onClick={() => setActiveIndex(idx)}
                    className={`h-2.5 w-8 rounded-full transition-all ${idx === activeIndex ? "bg-amber-300" : "bg-white/20 hover:bg-white/40"}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-5 grid gap-y-10">
          <CategoryRow
            title="Phim Lẻ"
            items={value.single || []}
            getImageUrl={getImageUrl}
          />
          <CategoryRow
            title="Phim Bộ"
            items={value.series || []}
            getImageUrl={getImageUrl}
          />
          <CategoryRow
            title="Chiếu Rạp"
            items={value.movie || []}
            getImageUrl={getImageUrl}
          />
          <CategoryRow
            title="TV Show"
            items={value.tvshow || []}
            getImageUrl={getImageUrl}
          />
        </div>

        <div className="w-full h-10"></div>
      </div>
    </div>
  );
};

export default Home;
