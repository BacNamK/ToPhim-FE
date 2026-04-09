import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import iconLogo from "../image/IconToCom.png";
import iconUser from "../image/icons8-user-90.png";
import { search_movies, get_all_genres } from "../api/movies";
import type { MovieItem, GenreItem } from "../types";

const Navbar = () => {
  const genresData = [
    {
      _id: "69d361366732faecf486ec34",
      name: "horror",
    },
    {
      _id: "69d361366732faecf486ec35",
      name: "romance",
    },
    {
      _id: "69d361366732faecf486ec36",
      name: "sci-fi",
    },
    {
      _id: "69d361366732faecf486ec30",
      name: "adventure",
    },
    {
      _id: "69d361366732faecf486ec31",
      name: "comedy",
    },
    {
      _id: " 69d361366732faecf486ec32",
      name: "drama",
    },
    {
      _id: "69d361366732faecf486ec33",
      name: "fantasy",
    },
    {
      _id: "69d361366732faecf486ec29",
      name: "action",
    },
    {
      _id: "69d361366732faecf486ec28",
      name: "thriller",
    },
  ];
  const [genresOpen, setGenresOpen] = useState(false);
  const navRef = useRef<HTMLDivElement | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<MovieItem[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [genres, setGenres] = useState<any[]>([genresData]);

  const baseUrl = import.meta.env.VITE_API_URL;

  const getImageUrl = (path?: string) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${baseUrl}${path}`;
  };

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (navRef.current && target && !navRef.current.contains(target)) {
        setGenresOpen(false);
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  useEffect(() => {
    const loadUser = () => {
      const raw = localStorage.getItem("tophim_user");
      if (!raw) {
        setDisplayName(null);
        return;
      }
      setDisplayName(raw ?? null);
    };

    loadUser();
    const handleStorage = (event: StorageEvent) => {
      if (!event.key || event.key === "tophim_user") {
        loadUser();
      }
    };
    const handleUserUpdate = () => loadUser();

    window.addEventListener("storage", handleStorage);
    window.addEventListener("tophim_user_updated", handleUserUpdate);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("tophim_user_updated", handleUserUpdate);
    };
  }, []);

  // Fetch genres from API
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await get_all_genres();
        if (response.genres) {
          setGenres(response.genres);
        }
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSearchResults([]);
      setIsDropdownOpen(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        const response = await search_movies(searchQuery);
        setSearchResults(response.data.movies || []);
        setIsDropdownOpen(true);
        console.log("Search results:", response.data);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <div
      ref={navRef}
      className="lg:w-full h-[10%] flex justify-around items-center bg-white"
    >
      <Link to={"/"} className="w-auto h-full flex items-center ml-5">
        <img src={iconLogo} className="size-13 rotate-10" alt="" />
        <div className="grid gap-y-0 pl-2">
          <span className="font-bold text-2xl">TOPHIM</span>
          <span className="text-sm font-bold tracking-normal">
            vừa ăn vừa xem{" "}
          </span>
        </div>
      </Link>
      <div className="w-[20%] h-full content-center p-2 relative">
        <input
          type="text"
          name=""
          id=""
          placeholder="Tìm kiếm phim ..."
          className="w-full h-[70%] shadow rounded-3xl pl-5 font-bold text-sm outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {isDropdownOpen && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
            {searchResults.map((movie) => (
              <Link
                key={movie._id}
                to={`/movie/${movie.slug}`}
                state={{ movie }}
                className="flex items-center p-3 hover:bg-gray-100"
                onClick={() => {
                  setIsDropdownOpen(false);
                  setSearchQuery("");
                }}
              >
                {movie.poster && (
                  <img
                    src={getImageUrl(movie.poster)}
                    alt={movie.name}
                    className="w-10 h-10 object-cover rounded mr-3"
                  />
                )}
                <span className="font-medium text-sm">{movie.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="w-[45%] h-full flex justify-center items-center gap-x-10 font-bold text-black text-sm relative">
        <div className="relative">
          <button
            type="button"
            onClick={() => setGenresOpen((prev) => !prev)}
            className="block hover:p-2 duration-300 rounded-2xl hover:bg-gray-100"
          >
            Thể loại
          </button>
          {genresOpen && (
            <div className="absolute left-0 mt-2 w-44 rounded-2xl bg-white shadow-lg border border-gray-200 z-50">
              {genresData.map((genre) => (
                <button
                  key={genre._id}
                  type="button"
                  onClick={() => {
                    navigate(`/genres/${genre._id}`);
                    setGenresOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100"
                >
                  {genre.name}
                </button>
              ))}
            </div>
          )}
        </div>
        <Link
          to={`/type/${encodeURIComponent("single")}`}
          className="block hover:p-2 duration-300 rounded-2xl hover:bg-gray-100"
        >
          Phim lẻ
        </Link>
        <Link
          to={`/type/${encodeURIComponent("series")}`}
          className="block hover:p-2 duration-300 rounded-2xl hover:bg-gray-100"
        >
          Phim bộ
        </Link>
        <Link
          to={`/type/${encodeURIComponent("movie")}`}
          className="block hover:p-2 duration-300 rounded-2xl hover:bg-gray-100"
        >
          Phim chiếu rạp
        </Link>
        <Link
          to={`/type/${encodeURIComponent("tvshow")}`}
          className="block hover:p-2 duration-300 rounded-2xl hover:bg-gray-100"
        >
          Tv Show
        </Link>
      </div>

      {displayName ? (
        <div className="relative z-20 group w-auto">
          <div className="relative z-20 shadow-white w-full h-9 px-4 bg-black rounded-3xl flex gap-2 justify-center items-center text-white">
            <img src={iconUser} className="size-5" alt="" />
            <p className="font-bold text-sm">{displayName}</p>
          </div>

          <div className="absolute right-0 z-10 -mt-5 pt-5 w-full rounded-b-2xl bg-black text-white shadow-lg opacity-0 pointer-events-none origin-top scale-y-0 transition-all duration-200 group-hover:opacity-100 group-hover:pointer-events-auto group-hover:scale-y-100">
            <Link
              to={"/manage"}
              className="block px-4 py-2 text-sm font-semibold hover:bg-white/10 rounded-2xl"
            >
              Quản Trị
            </Link>
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem("tophim_user");
                setDisplayName(null);
                window.dispatchEvent(new Event("tophim_user_updated"));
              }}
              className="w-full text-left px-4 py-2 text-sm font-semibold hover:bg-white/10 rounded-b-2xl"
            >
              Đăng Xuất
            </button>
          </div>
        </div>
      ) : (
        <Link
          to={"/register_login"}
          className="w-24 h-9 bg-black rounded-3xl flex justify-center items-center"
        >
          <p className="text-white font-bold text-sm p-1">Đăng Nhập</p>
        </Link>
      )}
    </div>
  );
};
export default Navbar;
