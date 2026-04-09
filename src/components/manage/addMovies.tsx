import { useState } from "react";
import api from "../../api/http";

const AddMovies = () => {
  const [name, setName] = useState("");
  const [decripstion, setDecripstion] = useState("");
  const [genres, setGenres] = useState("");
  const [country, setCountry] = useState("");
  const [type, setType] = useState("movie");
  const [releaseDate, setReleaseDate] = useState("");
  const [poster, setPoster] = useState<File | null>(null);
  const [backdoor, setBackdoor] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      const form = new FormData();
      form.append("name", name);
      form.append("decripstion", decripstion);
      form.append("genres", genres);
      form.append("country", country);
      form.append("type", type);
      form.append("release_date", releaseDate);
      if (poster) form.append("poster", poster);
      if (backdoor) form.append("backdoor", backdoor);

      await api.post("/manage/movie", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("Thêm phim thành công");
      setName("");
      setDecripstion("");
      setGenres("");
      setCountry("");
      setType("movie");
      setReleaseDate("");
      setPoster(null);
      setBackdoor(null);
    } catch (err) {
      setMessage("Thêm phim thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full h-[90%] p-4">
      <div className="w-full h-full grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-3">
          <div className=" h-full rounded-2xl border border-white/10 bg-white/5 p-4 text-center content-center">
            {poster ? (
              <img
                src={URL.createObjectURL(poster)}
                alt="Poster"
                className="mx-auto max-h-full rounded-lg object-contain"
              />
            ) : (
              <span className="text-white/60 text-sm">Chưa có poster</span>
            )}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-9">
          <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={loading}
                className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-bold text-white"
              >
                {loading ? "Đang lưu..." : "Lưu phim"}
              </button>
              <span className="text-xs text-white/60">{message}</span>
            </div>

            <div className=" grid grid-cols-12 gap-4 text-white">
              <div className="col-span-12">
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tên Phim ..."
                  className="mt-2 h-11 w-full rounded-xl bg-white/5 px-3 text-sm outline-none border border-white/10 focus:border-white/30"
                />
              </div>

              <div className="col-span-12">
                <textarea
                  name="decripstion"
                  value={decripstion}
                  onChange={(e) => setDecripstion(e.target.value)}
                  placeholder="Mô tả ngắn về nội dung phim..."
                  className="mt-2 h-36 w-full rounded-xl bg-white/5 px-3 py-2 text-sm outline-none border border-white/10 focus:border-white/30"
                ></textarea>
              </div>

              <div className="col-span-12 md:col-span-6">
                <input
                  type="text"
                  name="genres"
                  value={genres}
                  onChange={(e) => setGenres(e.target.value)}
                  placeholder="Thể loại"
                  className="mt-2 h-11 w-full rounded-xl bg-white/5 px-3 text-sm outline-none border border-white/10 focus:border-white/30"
                />
              </div>

              <div className="col-span-12 md:col-span-6">
                <input
                  type="text"
                  name="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Quốc Gia"
                  className="mt-2 h-11 w-full rounded-xl bg-white/5 px-3 text-sm outline-none border border-white/10 focus:border-white/30"
                />
              </div>

              <div className="col-span-12 md:col-span-6 ">
                <select
                  name="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="mt-2 h-11 w-full rounded-xl bg-white/5 px-3 text-sm outline-none border border-white/10 focus:border-white/30"
                >
                  <option className="bg-[#1b1b1b]" value="movie">
                    Movie
                  </option>
                  <option className="bg-[#1b1b1b]" value="single">
                    Single
                  </option>
                  <option className="bg-[#1b1b1b]" value="series">
                    Series
                  </option>
                  <option className="bg-[#1b1b1b]" value="tvshow">
                    TV Show
                  </option>
                </select>
              </div>

              <div className="col-span-12 md:col-span-6">
                <input
                  type="date"
                  name="release_date"
                  value={releaseDate}
                  onChange={(e) => setReleaseDate(e.target.value)}
                  className="mt-2 h-11 w-full rounded-xl bg-white/5 px-3 text-sm outline-none border border-white/10 focus:border-white/30"
                />
              </div>

              <div className="col-span-12 md:col-span-6">
                <label
                  htmlFor="poster"
                  className="w-full h-11 mt-2 block rounded-xl bg-white/5 px-3 text-sm outline-none border border-white/10 focus:border-white/30 content-center"
                >
                  {poster ? poster.name : "Poster"}
                  <input
                    type="file"
                    name="poster"
                    id="poster"
                    accept="image/*"
                    onChange={(e) => setPoster(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="col-span-12 md:col-span-6">
                <label
                  htmlFor="backdoor"
                  className="w-full h-11 mt-2 block rounded-xl bg-white/5 px-3 text-sm outline-none border border-white/10 focus:border-white/30 content-center"
                >
                  {backdoor ? backdoor.name : "Backdoor"}
                  <input
                    type="file"
                    name="backdoor"
                    id="backdoor"
                    accept="image/*"
                    onChange={(e) => setBackdoor(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddMovies;
