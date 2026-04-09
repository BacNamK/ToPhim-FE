import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { get_episodes } from "../api/movies";
import type { MovieItem, EpisodeItem } from "../types";

// Mở rộng MovieItem để hỗ trợ danh sách tập phim (giả định cấu trúc từ Backend)
export interface ExtendedMovieItem extends MovieItem {
  // Export để có thể dùng ở nơi khác nếu cần
  episodes?: EpisodeItem[];
}

const PlayMovies = () => {
  const location = useLocation();
  const movie = location.state?.movie as ExtendedMovieItem; // Đảm bảo movie có kiểu ExtendedMovieItem

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [episodes, setEpisodes] = useState<EpisodeItem[]>([]);
  const [, setLoadingEpisodes] = useState(false);

  if (!movie) {
    return (
      <div className="flex h-screen items-center justify-center text-white">
        <div className="text-center">
          <p className="text-xl font-bold">Không tìm thấy thông tin phim</p>
          <Link
            to="/"
            className="mt-4 inline-block text-amber-400 hover:underline"
          >
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
  const getImageUrl = (path?: string) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${baseUrl}${path}`;
  };

  // Fetch episodes khi component mount
  useEffect(() => {
    const fetchEpisodes = async () => {
      if (movie._id && (movie.type === "series" || movie.type === "tvshow")) {
        setLoadingEpisodes(true);
        try {
          const data = await get_episodes(movie._id);
          setEpisodes(data.episodes);
        } catch (error) {
          console.error("Failed to fetch episodes:", error);
        } finally {
          setLoadingEpisodes(false);
        }
      }
    };
    fetchEpisodes();
  }, [movie._id, movie.type]);

  const hasEpisodes = episodes.length > 0;

  // Nếu không tìm thấy movie hoặc không có episodes và đang cố tình truy cập phase play (logic phòng ngừa)
  useEffect(() => {
    if (isPlaying && !hasEpisodes) {
      setIsPlaying(false);
    }
  }, [isPlaying, hasEpisodes]);

  const currentEpisode = hasEpisodes ? episodes[currentEpisodeIndex] : null;

  // --- Phase 1: Hiển thị thông tin phim ---
  if (!isPlaying) {
    return (
      <div className="h-screen bg-slate-950 text-white p-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row gap-20">
            {/* Poster */}
            <div className="w-full md:w-1/3 shrink-0">
              <img
                src={getImageUrl(movie.poster)}
                alt={movie.name}
                className="w-full rounded-3xl shadow-2xl border border-white/10 object-cover aspect-2/3"
              />
            </div>

            {/* Thông tin */}
            <div className="flex-1 space-y-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
                  {movie.name}
                </h1>
                <div className="mt-4 flex flex-wrap gap-3">
                  <span className="px-3 py-1 bg-amber-400/20 border border-amber-400/30 text-amber-400 rounded-full text-xs font-bold uppercase">
                    {movie.country || "N/A"}
                  </span>
                  <span className="px-3 py-1 bg-white/10 border border-white/20 text-white/80 rounded-full text-xs font-bold">
                    {movie.release_date
                      ? new Date(movie.release_date).getFullYear()
                      : "2024"}
                  </span>
                  <span className="px-3 py-1 bg-white/10 border border-white/20 text-white/80 rounded-full text-xs font-bold uppercase">
                    {movie.type}
                  </span>
                </div>
              </div>

              <p className="text-slate-300 leading-relaxed text-lg italic">
                {movie.decripstion || "Chưa có mô tả cho phim này."}
              </p>

              {hasEpisodes ? (
                <>
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <span className="w-1 h-6 bg-amber-400 rounded-full"></span>
                      Danh sách tập
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => setIsPlaying(true)}
                        className=" bg-amber-400 text-black font-black rounded-2xl text-sm p-1 hover:scale-105 transition-transform shadow-[0_0_30px_rgba(251,191,36,0.3)]"
                      >
                        XEM PHIM NGAY
                      </button>
                      {episodes.map((ep, index) => (
                        <button
                          key={ep._id}
                          onClick={() => {
                            setCurrentEpisodeIndex(index);
                            setIsPlaying(true);
                          }}
                          className="px-6 py-2 bg-white/5 border border-white/10 hover:bg-amber-400 hover:text-black transition-all rounded-xl font-bold"
                        >
                          {ep.title}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="mt-8 p-8 bg-white/5 border border-dashed border-white/20 rounded-3xl text-center">
                  <p className="text-amber-400 font-bold">
                    Phim hiện đang được cập nhật các tập phim. Vui lòng quay lại
                    sau!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Kiểm tra an toàn trước khi render Phase 2
  if (!currentEpisode) return null;

  // --- Phase 2: Trình phát Video ---
  return (
    <div className="max-h-screen bg-black text-white p-4 overflow-y-auto custom-scrollbar">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setIsPlaying(false)}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors font-bold"
          >
            ‹ Quay lại thông tin
          </button>
        </div>

        {/* Iframe Player */}
        <div className=" aspect-video w-[70%] h-[80%] flex rounded-2xl overflow-hidden bg-slate-900 shadow-2xl ring-1 ring-white/10">
          <iframe
            src={currentEpisode.resources}
            title={currentEpisode.title}
            className=" h-full w-full block "
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>

        {/* Chọn tập nhanh ở Phase 2 */}
        <div className="mt-8">
          <h3 className="text-lg font-bold mb-4 opacity-70 uppercase tracking-widest">
            Chọn tập phim
          </h3>
          <div className="flex flex-wrap gap-2">
            {episodes.map((ep, index) => (
              <button
                key={ep._id}
                onClick={() => setCurrentEpisodeIndex(index)}
                className={`px-5 py-2 rounded-lg font-bold transition-all ${
                  currentEpisodeIndex === index
                    ? "bg-amber-400 text-black"
                    : "bg-white/5 border border-white/10 hover:bg-white/10"
                }`}
              >
                {ep.title}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full h-20"></div>
    </div>
  );
};

export default PlayMovies;
