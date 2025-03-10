"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getServerCookie } from "./GetServerCookie";
import { deleteServerCookie } from "./deleteServerCookie";
import { jwtDecode } from "jwt-decode";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false); // Thêm state để kiểm tra quyền admin

  useEffect(() => {
    async function fetchToken() {
      try {
        const serverToken = await getServerCookie("jwtToken");
        if (!serverToken) {
          console.log("Token không tồn tại");
          return;
        }

        const decodedToken = jwtDecode(serverToken);
        const roles = decodedToken.role;

        setIsLoggedIn(!!serverToken);
        setIsAdmin(roles[0] === "ADMIN");
      } catch (error) {
        console.error("Lỗi giải mã token:", error);
      }
    }

    fetchToken();
  }, []);

  const handleLogout = async () => {
    await deleteServerCookie("jwtToken");
    await deleteServerCookie("refreshToken");
    setIsLoggedIn(false);
    router.replace("/login"); // Chuyển trang ngay lập tức
  };

  if (isLoggedIn === null) {
    return null;
  }

  return (
    <header className="h-16 fixed top-0 left-0 w-full bg-gradient-to-r from-blue-400 to-purple-500 text-white shadow-md z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/">
          <h1 className="text-2xl font-bold tracking-tight">My Website</h1>
          <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
        </Link>
        <nav>
          <ul className="flex space-x-6 items-center">
            <li>
              <Link
                href="/"
                className="text-white hover:text-gray-200 transition-colors duration-200 transform hover:scale-105"
              >
                Home
                <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>

            {isLoggedIn ? (
              <>
                {isAdmin && (
                  <li>
                    <Link
                      href="/dashboard"
                      className="relative group text-white hover:text-gray-200 transition-colors duration-200 transform hover:scale-105"
                    >
                      DashBoard
                      <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  </li>
                )}
                <li>
                  <Link
                    href="/profile"
                    className="relative group text-white hover:text-gray-200 transition-colors duration-200 transform hover:scale-105"
                  >
                    Profile
                    <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-28 h-10 mx-2 cursor-pointer px-5 py-2 font-semibold bg-gray-100 text-gray-700 rounded-md shadow-sm hover:bg-red-500 hover:text-white transition-all duration-300 scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 text-base"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link
                  href="/login"
                  className="w-28 h-10 mx-2 cursor-pointer px-5 py-2 font-semibold bg-gray-100 text-gray-700 rounded-md shadow-sm hover:bg-blue-500 hover:text-white transition-all duration-300 scale-105 focus:outline-none focus:ring-blue-500 focus:ring-opacity-50 text-base"
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
