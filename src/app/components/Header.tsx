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
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu

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
    router.replace("/login");
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen); // Function to toggle menu

  if (isLoggedIn === null) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 w-full bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-xl z-50 py-2 sm:py-4">
      {/* Adjusted padding for smaller screens */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
        {/* Adjusted padding for smaller screens */}
        {/* Logo */}
        <div>
          <Link
            href="/"
            className="flex items-center gap-1 sm:gap-2" // Reduced gap on smaller screens
          >
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight hover:text-gray-100 transition-colors duration-300">
              MPH - Laptop
            </span>
            <span className="text-xs sm:text-sm font-semibold text-yellow-300">
              Chính hãng
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="hidden sm:block">
          {/* Hide on smaller screens, show on small screens and above */}
          <ul className="flex items-center space-x-4 sm:space-x-8">
            <li>
              <Link
                href="/"
                className="relative group text-base sm:text-lg font-semibold hover:text-yellow-300 transition-colors duration-300"
              >
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>

            {isLoggedIn ? (
              <>
                {isAdmin && (
                  <li>
                    <Link
                      href="/dashboard"
                      className="relative group text-base sm:text-lg font-semibold hover:text-yellow-300 transition-colors duration-300"
                    >
                      Dashboard
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  </li>
                )}
                <li>
                  <Link
                    href="/profile"
                    className="relative group text-base sm:text-lg font-semibold hover:text-yellow-300 transition-colors duration-300"
                  >
                    Profile
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="cursor-pointer relative group px-2 sm:px-4 py-1 sm:py-2 font-semibold text-base sm:text-lg text-gray-700 bg-yellow-300 rounded-md shadow-md hover:bg-red-500 hover:text-white transition-all duration-300"
                  >
                    Logout
                    <span className="absolute -bottom-0 left-0 w-0 h-0.5 bg-red-700 transition-all duration-300 group-hover:w-full"></span>
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link
                  href="/login"
                  className="relative group px-2 sm:px-4 py-1 sm:py-2 font-semibold text-base sm:text-lg text-gray-700 bg-yellow-300 rounded-md shadow-md hover:bg-green-500 hover:text-white transition-all duration-300"
                >
                  Login
                  <span className="absolute -bottom-0 left-0 w-0 h-0.5 bg-green-700 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
            )}
          </ul>
        </nav>
        {/* Mobile menu (hamburger icon) - Add your implementation here */}
        <div className="sm:hidden">
          <button
            className="text-white focus:outline-none"
            onClick={toggleMobileMenu}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="absolute top-full left-0 w-full bg-white shadow-md rounded-md overflow-hidden">
              <ul className="py-2">
                <li>
                  <Link
                    href="/"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Home
                  </Link>
                </li>
                {isLoggedIn ? (
                  <>
                    {isAdmin && (
                      <li>
                        <Link
                          href="/dashboard"
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                        >
                          Dashboard
                        </Link>
                      </li>
                    )}
                    <li>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                      >
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <li>
                    <Link
                      href="/login"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Login
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
