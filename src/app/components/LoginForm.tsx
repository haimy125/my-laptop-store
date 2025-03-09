"use client";

import Link from "next/link"; // Import Link
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getServerCookie } from "./GetServerCookie";
import { setServerCookie } from "./setServerCookie";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkLoginStatus() {
      const token = await getServerCookie("jwtToken"); // Lấy token từ server
      if (token) {
        setIsLoggedIn(true);
        router.push("/"); // Nếu đã đăng nhập, chuyển hướng về trang chủ
      }
    }
    checkLoginStatus();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/auth/authenticate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      if (!response.ok) {
        throw new Error("Tên đăng nhập hoặc mật khẩu không đúng");
      }

      const data = await response.json();

      document.cookie = `jwtToken=${data.token}; path=/; max-age=${
        7 * 24 * 60 * 60
      }`;
      document.cookie = `refreshToken=${data.refreshToken}; path=/; max-age=${
        30 * 24 * 60 * 60
      }`;

      await setServerCookie("jwtToken", data.token, 7);
      await setServerCookie("refreshToken", data.token, 30);

      router.push("/");
    } catch (err: any) {
      setError(err.message || "Đã có lỗi xảy ra");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden transition-transform transform">
        <div className="px-10 py-12">
          <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
            Đăng nhập
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                role="alert"
              >
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Tên đăng nhập
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="px-4 py-3 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-3 transition duration-300 hover:shadow-md"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Mật khẩu
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="px-4 py-3 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-3 transition duration-300 hover:shadow-md"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="cursor-pointer group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 hover:scale-105"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  {/* Heroicon name: solid/lock-closed */}
                  <svg
                    className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400 transition duration-300"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                Đăng nhập
              </button>
            </div>
          </form>

          <div className="mt-2 text-center">
            <Link
              href="/register"
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              Bạn chưa có tài khoản? Đăng ký ngay!
            </Link>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Hoặc đăng nhập bằng
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={handleGoogleLogin}
                className="cursor-pointer relative inline-flex items-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 hover:scale-105"
              >
                <span className="sr-only">Đăng nhập với Google</span>
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 36 36"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <clipPath id="clipPath">
                      <rect x="0" y="0" width="36" height="36" fill="none" />
                    </clipPath>
                  </defs>
                  <g clipPath="url(#clipPath)">
                    <path
                      d="M16 16v7.641h4.687c-.446 2.193-2.24 3.639-4.792 3.639-3.859 0-6.276-2.622-6.276-5.879 0-3.247 2.417-5.879 6.276-5.879 2.544 0 4.334 1.452 4.792 3.634l.006-.002c.266-2.485 2.475-4.039 4.757-4.039 3.87 0 6.28 2.622 6.28 5.879 0 3.248-2.414 5.88-6.28 5.88zm-.086 3.125h4.757v3.461h-4.757z"
                      fill="#4285F4"
                    />
                    <path
                      d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.24 3.639-4.792 3.639-3.859 0-6.276-2.622-6.276-5.879 0-3.247 2.417-5.879 6.276-5.879 2.544 0 4.334 1.452 4.792 3.634l.006-.002c.266-2.485 2.475-4.039 4.757-4.039 3.87 0 6.28 2.622 6.28 5.879 0 3.248-2.414 5.88-6.28 5.88zm-10.083-6.256v12.512c0 .589-.011 1.187-.031 1.776h.042c1.634-.112 3.034-.54 4.223-1.188l.003-.002L18.16 14.117c-.841 1.019-2.005 1.617-3.359 1.919l.003-.002-3.834-.011c.236-.182.479-.372.721-.562l.003.002v-3.461h-4.757v-.015c0-.589.011-1.187.031-1.776h-.042c-1.634.112-3.034.54-4.223 1.188l-.003.002L1.84 5.883c.841-1.019 2.005-1.617 3.359-1.919l-.003.002 3.834.011c-.236.182-.479.372-.721.562l-.003.002zm-.086 3.125h4.757v3.461h-4.757z"
                      fill="#4285F4"
                    />
                    <path
                      d="M16 16v7.641h4.687c-.446 2.193-2.24 3.639-4.792 3.639-3.859 0-6.276-2.622-6.276-5.879 0-3.247 2.417-5.879 6.276-5.879 2.544 0 4.334 1.452 4.792 3.634l.006-.002c.266-2.485 2.475-4.039 4.757-4.039 3.87 0 6.28 2.622 6.28 5.879 0 3.248-2.414 5.88-6.28 5.88zm-.086 3.125h4.757v3.461h-4.757z"
                      fill="#4285F4"
                    />
                    <path
                      d="M31.783 15.615c.841 1.019 2.005 1.617 3.359 1.919l.003-.002 3.834.011c-.236.182-.479.372-.721.562l.003.002v-3.461h-4.757v-.015c0-.589.011-1.187.031-1.776h-.042c-1.634.112-3.034.54-4.223 1.188l-.003.002L18.16 14.117c.841 1.019 2.005 1.617 3.359 1.919l.003-.002 3.834.011c-.236.182-.479.372.721.562l.003.002v-3.461h-4.757v-.015c0-.589.011-1.187.031-1.776h-.042c-1.634.112-3.034.54-4.223 1.188l-.003.002L1.84 5.883c.841-1.019 2.005-1.617 3.359-1.919l-.003.002 3.834.011c-.236.182-.479.372-.721.562l-.003.002zm-.086 3.125h4.757v3.461h-4.757z"
                      fill="#EA4335"
                    />
                    <path
                      d="M31.783 15.615c.841 1.019 2.005 1.617 3.359 1.919l.003-.002 3.834.011c-.236.182-.479.372.721.562l.003.002v-3.461h-4.757v-.015c0-.589.011-1.187.031-1.776h-.042c-1.634.112-3.034.54-4.223 1.188l-.003.002L18.16 14.117c.841 1.019 2.005 1.617 3.359 1.919l.003-.002 3.834.011c-.236.182-.479.372.721.562l.003.002v-3.461h-4.757v-.015c0-.589.011-1.187.031-1.776h-.042c-1.634.112-3.034.54-4.223 1.188l-.003.002L1.84 5.883c.841-1.019 2.005-1.617 3.359-1.919l-.003.002 3.834.011c-.236.182-.479.372.721.562l-.003.002zm-.086 3.125h4.757v3.461h-4.757z"
                      fill="#EA4335"
                    />
                    <path
                      d="M30.669 27.485l.003.002c1.189-.648 2.589-1.076 4.223-1.188h.042c.589.02.589.02 1.776.031v.015h4.757v3.461c-.242.19-.485.38-.721.562l-.003-.002-3.834-.011c-1.354.302-2.518.9-3.359 1.919l-.003-.002L18.16 21.883c.841-1.019 2.005-1.617 3.359-1.919l.003-.002 3.834-.011c.236-.182.479-.372.721-.562l.003-.002v-3.461h4.757v.015c0 .589-.011 1.187-.031 1.776h.042c1.634-.112 3.034-.54 4.223-1.188l.003-.002L18.16 14.117c.841 1.019 2.005 1.617 3.359 1.919l.003-.002 3.834.011c.236-.182.479-.372.721-.562l.003-.002v-3.461h4.757v.015c0 .589-.011 1.187-.031 1.776h.042c1.634-.112 3.034-.54 4.223-1.188l.003-.002L1.84 5.883c.841-1.019 2.005-1.617 3.359-1.919l-.003.002 3.834.011c-.236.182-.479.372-.721.562l-.003.002zm-.086 3.125h4.757v3.461h-4.757z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M30.669 27.485l.003.002c1.189-.648 2.589-1.076 4.223-1.188h.042c.589.02.589.02 1.776.031v.015h4.757v3.461c-.242.19-.485.38-.721.562l-.003-.002-3.834-.011c-1.354.302-2.518.9-3.359 1.919l-.003-.002L18.16 21.883c.841-1.019 2.005-1.617 3.359-1.919l.003-.002 3.834.011c.236-.182.479-.372.721-.562l.003-.002v-3.461h4.757v.015c0 .589-.011 1.187-.031 1.776h.042c1.634-.112 3.034-.54 4.223-1.188l.003-.002L1.84 5.883c.841-1.019 2.005-1.617 3.359-1.919l-.003.002 3.834.011c-.236.182-.479.372-.721.562l-.003.002zm-.086 3.125h4.757v3.461h-4.757z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M5.883 14.117c-.841-1.019-2.005-1.617-3.359-1.919l.003-.002 3.834-.011c.236-.182.479-.372.721-.562l.003.002v-3.461h4.757v.015c0 .589-.011 1.187-.031 1.776h-.042c-1.634.112-3.034.54-4.223 1.188l-.003.002L18.16 14.117c.841 1.019 2.005 1.617 3.359 1.919l.003-.002 3.834.011c-.236.182-.479.372.721.562l.003.002v-3.461h4.757v.015c0 .589-.011 1.187-.031 1.776h-.042c-1.634.112-3.034.54-4.223 1.188l-.003.002L1.84 5.883c.841-1.019 2.005-1.617 3.359-1.919l-.003.002 3.834.011c-.236.182-.479.372-.721.562l-.003.002zm-.086 3.125h4.757v3.461h-4.757z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.883 14.117c-.841-1.019-2.005-1.617-3.359-1.919l.003-.002 3.834-.011c.236-.182.479-.372.721-.562l.003.002v-3.461h4.757v.015c0 .589-.011 1.187-.031 1.776h-.042c-1.634.112-3.034.54-4.223 1.188l-.003.002L18.16 14.117c.841 1.019 2.005 1.617 3.359 1.919l.003-.002 3.834.011c-.236.182-.479.372.721.562l.003.002v-3.461h4.757v.015c0 .589-.011 1.187-.031 1.776h-.042c-1.634.112-3.034.54-4.223 1.188l-.003.002L1.84 5.883c.841-1.019 2.005-1.617 3.359-1.919l-.003.002 3.834.011c-.236.182-.479.372-.721.562l-.003.002zm-.086 3.125h4.757v3.461h-4.757z"
                      fill="#34A853"
                    />
                    <path
                      d="M16 16v7.641h4.687c-.446 2.193-2.24 3.639-4.792 3.639-3.859 0-6.276-2.622-6.276-5.879 0-3.247 2.417-5.879 6.276-5.879 2.544 0 4.334 1.452 4.792 3.634l.006-.002c.266-2.485 2.475-4.039 4.757-4.039 3.87 0 6.28 2.622 6.28 5.879 0 3.248-2.414 5.88-6.28 5.88zm-.086 3.125h4.757v3.461h-4.757z"
                      fill="#4285F4"
                    />
                    <path
                      d="M16 16v7.641h4.687c-.446 2.193-2.24 3.639-4.792 3.639-3.859 0-6.276-2.622-6.276-5.879 0-3.247 2.417-5.879 6.276-5.879 2.544 0 4.334 1.452 4.792 3.634l.006-.002c.266-2.485 2.475-4.039 4.757-4.039 3.87 0 6.28 2.622 6.28 5.879 0 3.248-2.414 5.88-6.28 5.88zm-.086 3.125h4.757v3.461h-4.757z"
                      fill="#4285F4"
                    />
                  </g>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
