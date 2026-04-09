import { useEffect, useState } from "react";

import AddMovies from "../components/manage/addMovies";
import ListMovies from "../components/manage/listMovies";
import { get_movies } from "../api/movies";
import { get_users } from "../api/users";
import type { MovieItem, MoviesResponse, UsersResponse } from "../types";

export type { MovieItem, MoviesResponse };

function IconUsers() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-16 w-16 text-white/90"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16 11a4 4 0 1 0-3.2-6.4A5 5 0 0 1 16 11Zm-8 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm8 2c-2.2 0-4.1.6-5.5 1.6-1.7-1-3.9-1.6-6.5-1.6-2.9 0-4 1.5-4 3.2V20h14v-2.8c0-1.9 1-2.2 2-3.2ZM2 20v-2.8c0-1.3.7-1.8 2-1.8 2.6 0 4.6.7 6 1.8V20H2Zm12 0h8v-2c0-1.3-1.1-2-3.2-2-1.8 0-3.3.4-4.8 1.2.1.3.1.5.1.8V20Z" />
    </svg>
  );
}

function IconMovies() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-16 w-16 text-white/90"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M3 5a2 2 0 0 1 2-2h2.2l.6 2H5v2h2.4l.6 2H5v2h2.8l.6 2H5v2h14V5h-2.2l-.6-2H19a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5Zm7 8h4v-2h-4v2Zm0 4h4v-2h-4v2Z" />
    </svg>
  );
}

function Manage() {
  const [items, setItems] = useState("");
  const [addMovies, setAddMovies] = useState(false);
  const [moviesData, setMoviesData] = useState<MoviesResponse | null>(null);
  const [moviesLoading, setMoviesLoading] = useState(true);
  const [moviesError, setMoviesError] = useState<string | null>(null);
  const [moviesPage, setMoviesPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const [usersData, setUsersData] = useState<UsersResponse | null>(null);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [usersPage, setUsersPage] = useState(1);
  const [searchQueryUsers, setSearchQueryUsers] = useState("");

  const [isDetail, setDetail] = useState(false);

  useEffect(() => {
    if (items !== "movies") {
      setMoviesData(null);
      setMoviesError(null);
      setMoviesLoading(false);
      setMoviesPage(1);
      setSearchQuery("");
      return;
    }

    if (addMovies) {
      return;
    }

    let isActive = true;
    const fetchMovies = async () => {
      try {
        setMoviesLoading(true);
        setMoviesError(null);
        const data = await get_movies(moviesPage);

        if (isActive) {
          setMoviesData(data);
          console.log(data);
        }
      } catch (e) {
        if (isActive) {
          setMoviesError("Không thể tải danh sách phim.");
        }
      } finally {
        if (isActive) {
          setMoviesLoading(false);
        }
      }
    };

    fetchMovies();
    return () => {
      isActive = false;
    };
  }, [items, moviesPage, addMovies]);

  useEffect(() => {
    if (items !== "users") {
      setUsersData(null);
      setUsersError(null);
      setUsersLoading(false);
      setUsersPage(1);
      setSearchQueryUsers("");
      return;
    }

    let isActive = true;
    const fetchUsers = async () => {
      try {
        setUsersLoading(true);
        setUsersError(null);
        const data = await get_users(usersPage);

        if (isActive) {
          setUsersData(data);
        }
      } catch (e) {
        if (isActive) {
          setUsersError("Không thể tải danh sách người dùng.");
        }
      } finally {
        if (isActive) {
          setUsersLoading(false);
        }
      }
    };

    fetchUsers();
    return () => {
      isActive = false;
    };
  }, [items, usersPage]);

  useEffect(() => {}, [items]);

  // Lọc phim dựa trên search query
  const filteredMoviesData = moviesData
    ? {
        ...moviesData,
        movies: moviesData.movies.filter((movie) =>
          movie.name?.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      }
    : null;
  // Lọc người dùng dựa trên search query
  const filteredUsersData = usersData
    ? {
        ...usersData,
        users: usersData.users.filter(
          (user) =>
            user.username
              .toLowerCase()
              .includes(searchQueryUsers.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQueryUsers.toLowerCase()),
        ),
      }
    : null;
  return (
    <div className="w-full h-[90%] flex gap-4 p-4">
      <div
        onClick={() => {
          setItems("users");
        }}
        className={`h-full transition-all duration-300 ease-in-out overflow-hidden ${items === "users" ? "w-full" : ""} ${items === "movies" ? "hidden" : ""} ${items === "" ? "flex-1" : ""}`}
      >
        <div
          className={`relative group w-full h-full rounded-2xl border border-white/10 bg-linear-to-br from-[#1b1b1b] via-[#222222] to-[#2d2d2d] shadow-[0_10px_40px_rgba(0,0,0,0.35)]`}
        >
          <div
            className={`w-full h-full grid place-items-center gap-3 ${items === "users" ? "hidden" : ""}`}
          >
            <div className="h-20 w-20 rounded-2xl bg-white/5 border border-white/10 grid place-items-center shadow-inner">
              <IconUsers />
            </div>
            <div className="text-center">
              <p className="text-xs tracking-[0.3em] uppercase text-white/50">
                Manage
              </p>
              <p className="text-2xl text-white font-bold">
                Quản Lý Người Dùng
              </p>
              <p className="text-sm text-white/60 mt-1">
                Danh sách, vai trò và trạng thái tài khoản
              </p>
            </div>
          </div>
          <div
            className={`w-full h-full overflow-hidden p-6 ${items === "users" ? "" : "hidden"}`}
          >
            {usersLoading ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-white">Đang tải...</p>
              </div>
            ) : usersError ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-red-400">{usersError}</p>
              </div>
            ) : filteredUsersData ? (
              <div className="space-y-4">
                <div className="grid gap-4">
                  {filteredUsersData.users.map((user) => (
                    <div
                      key={user._id}
                      className="bg-white/5 border border-white/10 rounded-xl p-4"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-white font-bold">
                            {user.username}
                          </p>
                          <p className="text-white/60 text-sm">{user.email}</p>
                          <p className="text-white/40 text-xs">
                            Tham gia:{" "}
                            {new Date(user.createdAt).toLocaleDateString(
                              "vi-VN",
                            )}
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-bold ${
                              user.role
                                ? "bg-amber-400/20 text-amber-400 border border-amber-400/30"
                                : "bg-white/10 text-white/80 border border-white/20"
                            }`}
                          >
                            {user.role ? "Admin" : "User"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {filteredUsersData.users.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-white/60">
                      Không tìm thấy người dùng nào.
                    </p>
                  </div>
                )}
              </div>
            ) : null}
          </div>
          <div
            className={`absolute bottom-0 w-full p-4 flex gap-6 ${items === "users" ? "" : "hidden"}`}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setItems("");
              }}
              className={`bg-white/5 border border-white/20 text-white px-4 py-2 rounded-full text-sm font-bold shadow `}
            >
              Quay lại
            </button>
            <input
              type="text"
              name=""
              id=""
              placeholder="Tìm kiếm người dùng"
              value={searchQueryUsers}
              onChange={(e) => setSearchQueryUsers(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className={`w-[25%] bg-white/5 outline-none text-white px-4 py-2 rounded-full text-sm shadow-w outline font-bold`}
            />
            <div
              className={`w-[15%] bg-white/5 flex gap-2 text-white px-4 py-2 rounded-full text-sm font-bold shadow `}
            >
              <span className="opacity-60">Trang</span>
              <span className="mx-2 text-white/80">
                {usersData ? usersData.page : usersPage}/
                {usersData?.total_page ?? 1}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setUsersPage((prev) => Math.max(1, prev - 1));
                }}
                disabled={usersPage <= 1}
                className="px-2 rounded-full bg-white/5 border border-white/10 text-white/70 disabled:opacity-40"
              >
                Trước
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const total = usersData?.total_page ?? usersPage;
                  setUsersPage((prev) => Math.min(total, prev + 1));
                }}
                disabled={usersData ? usersPage >= usersData.total_page : false}
                className="px-2 rounded-full bg-white/5 border border-white/10 text-white/70 disabled:opacity-40"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        onClick={() => setItems("movies")}
        className={`h-full transition-all duration-300 ease-in-out overflow-hidden custom-scrollbar overflow-y-auto ${items === "movies" ? "w-full" : ""} ${items === "users" ? "hidden" : ""} ${items === "" ? "flex-1" : ""}`}
      >
        <div className="relative group w-full h-full rounded-2xl border border-white/10 bg-linear-to-br from-[#191b2a] via-[#1f1f2a] to-[#2a1b2a] shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
          {""}
          <div
            className={`w-full h-full overflow-hidden ${items === "" ? "hidden" : ""}`}
          >
            {addMovies ? (
              <AddMovies />
            ) : (
              <ListMovies
                data={filteredMoviesData}
                loading={moviesLoading}
                error={moviesError}
                isDetail={isDetail}
                setDetail={setDetail}
              />
            )}
          </div>

          <div
            className={`w-full h-full grid place-items-center gap-3 ${items === "movies" ? "hidden" : ""}`}
          >
            <div className="h-20 w-20 rounded-2xl bg-white/5 border border-white/10 grid place-items-center shadow-inner">
              <IconMovies />
            </div>
            <div className="text-center">
              <p className="text-xs tracking-[0.3em] uppercase text-white/50">
                Manage
              </p>
              <p className="font-bold text-2xl text-white">Quản lý Phim</p>
              <p className="text-sm text-white/60 mt-1">
                Kho phim, thể loại và lịch chiếu
              </p>
            </div>
          </div>

          <div
            className={`absolute bottom-0 w-full p-4 flex gap-6 ${items === "movies" ? "" : "hidden"} ${isDetail ? "hidden" : ""}`}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setItems("");
              }}
              className={`bg-white/5 border border-white/20 text-white px-4 py-2 rounded-full text-sm font-bold shadow `}
            >
              Quay lại
            </button>
            <input
              type="text"
              name=""
              id=""
              placeholder="Tìm kiếm phim"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className={`w-[25%] bg-white/5 outline-none text-white px-4 py-2 rounded-full text-sm shadow-w outline font-bold`}
            />
            <div
              className={`w-[15%] bg-white/5 flex gap-2 text-white px-4 py-2 rounded-full text-sm font-bold shadow `}
            >
              <span className="opacity-60">Trang</span>
              <span className="mx-2 text-white/80">
                {moviesData ? moviesData.page : moviesPage}/
                {moviesData?.total_page ?? 1}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMoviesPage((prev) => Math.max(1, prev - 1));
                }}
                disabled={moviesPage <= 1}
                className="px-2 rounded-full bg-white/5 border border-white/10 text-white/70 disabled:opacity-40"
              >
                Trước
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const total = moviesData?.total_page ?? moviesPage;
                  setMoviesPage((prev) => Math.min(total, prev + 1));
                }}
                disabled={
                  moviesData ? moviesPage >= moviesData.total_page : false
                }
                className="px-2 rounded-full bg-white/5 border border-white/10 text-white/70 disabled:opacity-40"
              >
                Sau
              </button>
            </div>
            <div
              onClick={() => {
                setAddMovies(!addMovies);
              }}
              className="w-[8%] bg-white/5  text-white px-4 py-2 rounded-full justify-items-center text-sm font-bold shadow cursor-default"
            >
              <span className="opacity-60 block">
                {addMovies ? "Danh sách" : "Thêm Phim"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Manage;
