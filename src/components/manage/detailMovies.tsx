import { useState } from "react";
import { post_episode } from "../../api/movies";

type DetailMovie = {
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

type DetailMoviesProps = {
  detailmovie: DetailMovie | null;
  isDetail: boolean;
  setDetail: (value: boolean) => void;
};

const DetailMovies = ({
  detailmovie,
  isDetail,
  setDetail,
}: DetailMoviesProps) => {
  const [showEdit, setShowEdit] = useState(false);
  const [episodeTitle, setEpisodeTitle] = useState("");
  const [episodeResource, setEpisodeResource] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

  const getImageUrl = (path?: string) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${baseUrl}${path}`;
  };

  const posterUrl = getImageUrl(detailmovie?.poster);

  const handleAddEpisode = async () => {
    if (!episodeTitle || !episodeResource || !detailmovie?._id) {
      setMessage("Vui lòng điền đầy đủ thông tin");
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      await post_episode({
        title: episodeTitle,
        resources: episodeResource,
        from: detailmovie._id,
      });
      setMessage("Thêm tập thành công");
      setEpisodeTitle("");
      setEpisodeResource("");
    } catch (err) {
      setMessage("Thêm tập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full grid grid-cols-12 gap-6">
      <div className="col-span-12 xl:col-span-4 h-full">
        <div className="h-full rounded-2xl flex flex-col gap-4">
          <div className="flex-1">
            {posterUrl ? (
              <img
                src={posterUrl}
                className="w-full h-[79%] rounded-xl object-cover"
                alt={detailmovie?.name || "movie"}
              />
            ) : (
              <div className="w-full h-full rounded-xl grid place-items-center text-white/40 text-sm bg-white/0.03 border border-white/10">
                No poster
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="col-span-12 xl:col-span-8 h-full flex flex-col gap-6 overflow-hidden">
        <div
          className={`rounded-2xl border border-white/10 bg-linear-to-br from-[#221c2b] via-[#1c1a24] to-[#1a1820] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.25)] ${showEdit ? "hidden" : ""}`}
        >
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-[0.2em] text-white/50">
                Tiêu đề tập
              </label>
              <input
                value={episodeTitle}
                onChange={(e) => setEpisodeTitle(e.target.value)}
                placeholder="Tập .."
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-[0.2em] text-white/50">
                Resource
              </label>
              <input
                value={episodeResource}
                onChange={(e) => setEpisodeResource(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white outline-none"
              />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={handleAddEpisode}
              disabled={loading}
              className="px-5 py-2.5 rounded-full text-sm font-semibold bg-white text-black"
            >
              {loading ? "Đang thêm..." : "Thêm tập"}
            </button>
            {message && (
              <span className="text-xs text-white/60">{message}</span>
            )}
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-linear-to-br from-[#1c1e2b] via-[#1a1b24] to-[#171821] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.25)] custom-scrollbar overflow-y-auto">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-white/50">
                Chỉnh sửa
              </p>
              <p className="text-xl text-white font-bold mt-1">
                Thông tin phim
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowEdit((prev) => !prev)}
                className="px-4 py-2 rounded-full text-sm font-semibold bg-white/5 text-white/80 border border-white/10"
              >
                {showEdit ? "Ẩn" : "Hiện"}
              </button>
              <button className="px-4 py-2 rounded-full text-sm font-semibold bg-white/5 text-white/80 border border-white/10">
                Làm mới
              </button>
              <button className="px-4 py-2 rounded-full text-sm font-semibold bg-white text-black">
                Lưu thay đổi
              </button>
            </div>
          </div>

          <div className={`mt-6 ${showEdit ? "" : "hidden"}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-[0.2em] text-white/50">
                  Tên phim
                </label>
                <input
                  defaultValue={detailmovie?.name || ""}
                  placeholder="Nhập tên phim"
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white outline-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-[0.2em] text-white/50">
                  Quốc gia
                </label>
                <input
                  defaultValue={detailmovie?.country || ""}
                  placeholder="Nhập quốc gia"
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white outline-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-[0.2em] text-white/50">
                  Thể loại
                </label>
                <input
                  defaultValue={detailmovie?.genres?.join(", ") || ""}
                  placeholder="Hành động, Tâm lý..."
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white outline-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-[0.2em] text-white/50">
                  Loại phim
                </label>
                <input
                  defaultValue={detailmovie?.type || ""}
                  placeholder="Phim lẻ / Phim bộ"
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white outline-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-[0.2em] text-white/50">
                  Ngày phát hành
                </label>
                <input
                  defaultValue={detailmovie?.release_date || ""}
                  placeholder="YYYY-MM-DD"
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white outline-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-[0.2em] text-white/50">
                  Poster
                </label>
                <input
                  defaultValue={detailmovie?.poster || ""}
                  placeholder="/uploads/poster.jpg"
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white outline-none"
                />
              </div>
              <div className="md:col-span-2 flex flex-col gap-2">
                <label className="text-xs uppercase tracking-[0.2em] text-white/50">
                  Mô tả
                </label>
                <textarea
                  defaultValue={detailmovie?.decripstion || ""}
                  placeholder="Mô tả ngắn về nội dung phim"
                  rows={4}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white outline-none resize-none"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="w-full h-auto flex justify-center content-center">
          <button
            onClick={() => setDetail(!isDetail)}
            className={`bg-white/5 border border-white/20 text-white px-4 py-2 rounded-full text-sm font-bold shadow `}
          >
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailMovies;
