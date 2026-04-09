import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { get_movies_by_type } from "../api/movies";
import type { MovieItem, MoviesResponse } from "../types";

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
      className="group relative aspect-2/3 rounded-2xl overflow-hidden bg-slate-900 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-2xl"
    >
      <img
        src={getImageUrl(movie.poster)}
        alt={movie.name}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent transition-opacity duration-300 flex flex-col justify-end p-3">
        <p className="text-xs font-bold text-white line-clamp-2 leading-tight capitalize">
          {movie.name}
        </p>
        <div className="mt-2 flex gap-2 items-center">
          <span className="text-[10px] font-semibold text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded border border-blue-400/20 capitalize">
            {movie.type || "N/A"}
          </span>
          <span className="text-[10px] text-white/60">
            {movie.release_date
              ? new Date(movie.release_date).getFullYear()
              : "N/A"}
          </span>
        </div>
      </div>
    </Link>
  );
};

const typeLabels: Record<string, { label: string; color: string }> = {
  single: { label: "singles", color: "from-amber-500 to-amber-600" },
  series: { label: "series", color: "from-purple-500 to-purple-600" },
  tvshow: { label: "movies", color: "from-blue-500 to-blue-600" },
  movie: { label: "tvshow", color: "from-red-500 to-red-600" },
};

function TypeMovies() {
  const { type } = useParams<{ type: string }>();
  const [moviesData, setMoviesData] = useState<MoviesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const baseUrl = import.meta.env.VITE_API_URL;

  const getImageUrl = (path?: string) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${baseUrl}${path}`;
  };

  const typeInfo = type ? typeLabels[type as keyof typeof typeLabels] : null;

  useEffect(() => {
    if (!type || !typeLabels[type as keyof typeof typeLabels]) {
      setError("Loại phim không hợp lệ");
      setLoading(false);
      return;
    }

    let isActive = true;

    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await get_movies_by_type(type, currentPage);
        if (isActive) {
          setMoviesData(data.data);
        }
      } catch (err) {
        if (isActive) {
          setError("Không thể tải danh sách phim. Vui lòng thử lại.");
          console.error("Error fetching movies:", err);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchMovies();

    return () => {
      isActive = false;
    };
  }, [type, currentPage]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNextPage = () => {
    if (moviesData && currentPage < moviesData.total_page) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full min-h-screen p-4">
      <div className="">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-white/20 border-t-amber-400 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-white/60">Đang tải phim...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center">
            <p className="text-red-300 font-semibold">{error}</p>
            <button
              onClick={() => {
                setCurrentPage(1);
                setError(null);
              }}
              className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Movies Grid */}
        {!loading && !error && moviesData && (
          <>
            {moviesData.movies && moviesData.movies.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
                  {moviesData.movies.map((movie) => (
                    <MovieCard
                      key={movie._id}
                      movie={movie}
                      getImageUrl={getImageUrl}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {moviesData.total_page > 1 && (
                  <div className="flex items-center justify-center gap-4 py-8">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className="px-6 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold"
                    >
                      ← Trước
                    </button>

                    {/* Page numbers */}
                    <div className="flex items-center gap-2">
                      {Array.from(
                        { length: moviesData.total_page },
                        (_, i) => i + 1,
                      )
                        .filter((page) => {
                          const distance = Math.abs(page - currentPage);
                          return (
                            distance <= 1 ||
                            page === 1 ||
                            page === moviesData.total_page
                          );
                        })
                        .map((page, idx, arr) => (
                          <div key={page}>
                            {idx > 0 && arr[idx - 1] !== page - 1 && (
                              <span className="text-white/40">...</span>
                            )}
                            <button
                              onClick={() => setCurrentPage(page)}
                              className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                                currentPage === page
                                  ? "bg-blue-500 text-white"
                                  : "bg-white/10 text-white hover:bg-white/20"
                              }`}
                            >
                              {page}
                            </button>
                          </div>
                        ))}
                    </div>

                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === moviesData.total_page}
                      className="px-6 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold"
                    >
                      Sau →
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <p className="text-white/60 text-lg">
                  Không tìm thấy phim nào với loại {typeInfo?.label}
                </p>
              </div>
            )}
          </>
        )}

        {/* No data */}
        {!loading && !error && !moviesData && (
          <div className="text-center py-20">
            <p className="text-white/60">Chưa có dữ liệu</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TypeMovies;
