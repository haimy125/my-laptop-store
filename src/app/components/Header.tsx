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

  useEffect(() => {
    async function fetchToken() {
      try {
        const serverToken = await getServerCookie("jwtToken");
        if (!serverToken) {
          console.error("Token không tồn tại");
          return;
        }

        const decodedToken = jwtDecode(serverToken);
        const roles = decodedToken.role;
        console.log("role", roles);

        setIsLoggedIn(!!serverToken);
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
    return null; // hoặc một Skeleton UI tạm thời
  }

  return (
    <header className="h-16 fixed top-0 left-0 w-full bg-gradient-to-r from-blue-400 to-purple-500 text-white shadow-md z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          href="/"
        >
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
                    className="w-24 h-10 cursor-pointer px-5 py-2 font-mono bg-white text-gray-800 rounded-lg shadow-md hover:bg-red-600 hover:text-white transition-colors duration-300"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link
                  href="/login"
                  className="w-24 h-10 cursor-pointer px-5 py-2 font-mono bg-white text-gray-800 rounded-lg shadow-md hover:bg-green-500 hover:text-white transition-colors duration-300"
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
