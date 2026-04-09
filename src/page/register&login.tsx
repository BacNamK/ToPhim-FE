import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "../api/auth";

const RegisterLogin = () => {
  const [islogin, setLogin] = useState(true);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirm, setRegisterConfirm] = useState("");
  const [status, setStatus] = useState<{
    type: "idle" | "loading" | "success" | "error";
    message: string;
  }>({ type: "idle", message: "" });
  const navigate = useNavigate();

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus({ type: "loading", message: "Đang đăng nhập..." });
    try {
      const response = await login({
        email: loginEmail.trim(),
        password: loginPassword,
      });
      setStatus({
        type: "success",
        message: response.data?.message || "Đăng nhập thành công!",
      });

      localStorage.setItem("tophim_user", response.data?.username);
      window.dispatchEvent(new Event("tophim_user_updated"));
      navigate("/");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Đăng nhập thất bại, vui lòng thử lại.";
      setStatus({ type: "error", message });
    }
  };

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (registerPassword !== registerConfirm) {
      setStatus({ type: "error", message: "Mật khẩu xác nhận không khớp." });
      return;
    }
    setStatus({ type: "loading", message: "Đang tạo tài khoản..." });
    try {
      const response = await register({
        username: registerName.trim(),
        email: registerEmail.trim(),
        password: registerPassword,
      });
      console.log(response);
      setStatus({
        type: "success",
        message: response.data?.message || "Đăng kí thành công!",
      });
      setLogin(true);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Đăng kí thất bại, vui lòng thử lại.";
      setStatus({ type: "error", message });
    }
  };
  return (
    <div className="w-full min-h-screen px-4 py-10 flex justify-center items-center pt-18">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-6">
        <div className="hidden lg:flex flex-col justify-center rounded-3xl p-10 bg-black text-white relative overflow-hidden">
          <div className="absolute -top-10 -right-10 size-44 bg-white/10 rounded-full" />
          <div className="absolute -bottom-16 -left-16 size-56 bg-white/5 rounded-full" />
          <p className="text-sm font-semibold tracking-widest text-amber-300">
            TOPHIM ACCOUNT
          </p>
          <h2 className="text-4xl font-bold leading-tight mt-3">
            Đăng nhập để theo dõi phim yêu thích
          </h2>
          <p className="text-white/80 mt-4 text-base">
            Lưu danh sách, đánh dấu đang xem, và nhận gợi ý cá nhân hóa mỗi
            ngày.
          </p>
          <div className="mt-10 grid gap-3 text-sm text-white/80">
            <div className="flex items-center gap-3">
              <span className="size-2 bg-amber-300 rounded-full" />
              <span>Thông báo tập mới, lịch chiếu</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="size-2 bg-amber-300 rounded-full" />
              <span>Gợi ý phim theo gu của bạn</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="size-2 bg-amber-300 rounded-full" />
              <span>Đồng bộ trên nhiều thiết bị</span>
            </div>
          </div>
        </div>

        <div className="w-full bg-white shadow-xl rounded-3xl p-6">
          <div className="flex w-full items-center justify-center gap-8 font-bold text-lg">
            <button
              onClick={() => setLogin(true)}
              className={`pb-2 transition-colors ${
                islogin ? "border-b-2 border-black" : "text-black/50"
              }`}
            >
              Đăng Nhập
            </button>
            <button
              onClick={() => setLogin(false)}
              className={`pb-2 transition-colors ${
                islogin ? "text-black/50" : "border-b-2 border-black"
              }`}
            >
              Đăng Kí
            </button>
          </div>

          <div className="mt-8">
            {islogin ? (
              <form onSubmit={handleLogin} className="grid gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-semibold">
                    Email hoặc tên đăng nhập
                  </label>
                  <input
                    type="text"
                    placeholder="yourname@email.com"
                    value={loginEmail}
                    onChange={(event) => setLoginEmail(event.target.value)}
                    className="h-11 rounded-xl border border-black/10 px-4 outline-none focus:border-black"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-semibold">Mật khẩu</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(event) => setLoginPassword(event.target.value)}
                    className="h-11 rounded-xl border border-black/10 px-4 outline-none focus:border-black"
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-black/70">
                    <input type="checkbox" className="size-4" />
                    Ghi nhớ đăng nhập
                  </label>
                  <button className="font-semibold text-black">
                    Quên mật khẩu?
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={status.type === "loading"}
                  className="h-11 rounded-xl bg-black text-white font-semibold disabled:opacity-60"
                >
                  Đăng nhập
                </button>
                <div className="flex items-center gap-3 text-xs text-black/50">
                  <span className="flex-1 h-px bg-black/10" />
                  hoặc đăng nhập nhanh
                  <span className="flex-1 h-px bg-black/10" />
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <button className="h-11 rounded-xl border border-black/10 font-semibold">
                    Google
                  </button>
                  <button className="h-11 rounded-xl border border-black/10 font-semibold">
                    Facebook
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="grid gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-semibold">Họ và tên</label>
                  <input
                    type="text"
                    placeholder="Nguyễn Văn A"
                    value={registerName}
                    onChange={(event) => setRegisterName(event.target.value)}
                    className="h-11 rounded-xl border border-black/10 px-4 outline-none focus:border-black"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-semibold">Email</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={registerEmail}
                    onChange={(event) => setRegisterEmail(event.target.value)}
                    className="h-11 rounded-xl border border-black/10 px-4 outline-none focus:border-black"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-semibold">Mật khẩu</label>
                  <input
                    type="password"
                    placeholder="Tối thiểu 8 ký tự"
                    value={registerPassword}
                    onChange={(event) =>
                      setRegisterPassword(event.target.value)
                    }
                    className="h-11 rounded-xl border border-black/10 px-4 outline-none focus:border-black"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-semibold">
                    Xác nhận mật khẩu
                  </label>
                  <input
                    type="password"
                    placeholder="Nhập lại mật khẩu"
                    value={registerConfirm}
                    onChange={(event) => setRegisterConfirm(event.target.value)}
                    className="h-11 rounded-xl border border-black/10 px-4 outline-none focus:border-black"
                  />
                </div>
                <label className="flex items-start gap-2 text-sm text-black/70">
                  <input type="checkbox" className="mt-1 size-4" />
                  Tôi đồng ý với điều khoản sử dụng và chính sách bảo mật của
                  TOPHIM.
                </label>
                <button
                  type="submit"
                  disabled={status.type === "loading"}
                  className="h-11 rounded-xl bg-black text-white font-semibold disabled:opacity-60"
                >
                  Tạo tài khoản
                </button>
                <p className="text-center text-sm text-black/60">
                  Đã có tài khoản?{" "}
                  <button
                    type="button"
                    onClick={() => setLogin(true)}
                    className="font-semibold text-black"
                  >
                    Đăng nhập ngay
                  </button>
                </p>
              </form>
            )}
            {status.type !== "idle" && (
              <div
                className={`mt-4 text-sm font-semibold ${
                  status.type === "error" ? "text-red-600" : "text-green-600"
                }`}
              >
                {status.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterLogin;
