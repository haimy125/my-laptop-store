"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getServerCookie } from "./GetServerCookie";
import { deleteServerCookie } from "./deleteServerCookie";
import { jwtDecode } from "jwt-decode";

interface HeaderProps {
  onSearchResults: (results: any[]) => void;
}

const priceRanges = [
  { label: "Dưới 5 triệu", min: 0, max: 5000000 },
  { label: "5 - 10 triệu", min: 5000000, max: 10000000 },
  { label: "10 - 15 triệu", min: 10000000, max: 15000000 },
  { label: "15 - 20 triệu", min: 15000000, max: 20000000 },
  { label: "20 - 25 triệu", min: 20000000, max: 25000000 },
  { label: "25 - 30 triệu", min: 25000000, max: 30000000 },
  { label: "30 - 35 triệu", min: 30000000, max: 35000000 },
  { label: "35 - 40 triệu", min: 35000000, max: 40000000 },
  { label: "40 - 45 triệu", min: 40000000, max: 45000000 },
  { label: "45 - 50 triệu", min: 45000000, max: 50000000 },
  { label: "Trên 50 triệu", min: 50000000, max: 1000000000 },
];

export default function Header({ onSearchResults }: HeaderProps) {
  // State variables
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [minPriceInput, setMinPriceInput] = useState("");
  const [maxPriceInput, setMaxPriceInput] = useState("");

  const router = useRouter();

  // useEffect to fetch token and set user roles on component mount
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
        setIsAdmin(roles[0] === "ROLE_ADMIN");
      } catch (error) {
        console.error("Lỗi giải mã token:", error);
      }
    }

    fetchToken();
  }, []);

  // Handler function for user logout
  const handleLogout = async () => {
    await deleteServerCookie("jwtToken");
    await deleteServerCookie("refreshToken");
    setIsLoggedIn(false);
    router.replace("/login");
  };

  // Handler to toggle the mobile menu
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Handler for price range selection
  const handlePriceRangeChange = (e: any) => {
    setSelectedPriceRange(e.target.value);
    const range = priceRanges.find((r) => r.label === e.target.value);
    if (range) {
      fetchProductsByPriceRange(range.min, range.max);
    } else {
      onSearchResults([]);
    }
  };

  // Handler for custom price search
  const handleCustomPriceSearch = () => {
    const minPrice = parseFloat(minPriceInput);
    const maxPrice = parseFloat(maxPriceInput);

    if (!isNaN(minPrice) && !isNaN(maxPrice)) {
      fetchProductsByPriceRange(minPrice, maxPrice);
    } else {
      alert("Vui lòng nhập khoảng giá hợp lệ.");
    }
  };

  // Function to fetch products by price range
  const fetchProductsByPriceRange = async (
    minPrice: number,
    maxPrice: number
  ) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/products/price-range?minPrice=${minPrice}&maxPrice=${maxPrice}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      onSearchResults(data);
    } catch (error) {
      console.error("Lỗi tìm kiếm sản phẩm theo giá:", error);
      onSearchResults([]);
    }
  };

  // Render nothing if isLoggedIn is null (still loading)
  if (isLoggedIn === null) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 w-full bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-xl z-50">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-2 sm:py-4 flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-1 sm:gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight hover:text-gray-100 transition-colors duration-300">
              MPH - Laptop
            </span>
            <span className="text-xs sm:text-sm font-semibold text-yellow-300">
              Chính hãng
            </span>
          </Link>
        </div>

        {/* Navigation Section (Desktop) */}
        <nav className="hidden sm:block">
          <ul className="flex items-center space-x-4 sm:space-x-8">
            <li>
              <select
                value={selectedPriceRange}
                onChange={handlePriceRangeChange}
                className="form-select cursor-pointer"
              >
                <option value="">Chọn khoảng giá</option>
                {priceRanges.map((range) => (
                  <option key={range.label} value={range.label}>
                    {range.label}
                  </option>
                ))}
              </select>
            </li>
            <li className="flex items-center space-x-2">
              <input
                type="number"
                placeholder="Giá tối thiểu"
                value={minPriceInput}
                onChange={(e) => setMinPriceInput(e.target.value)}
                className="form-input"
              />
              <input
                type="number"
                placeholder="Giá tối đa"
                value={maxPriceInput}
                onChange={(e) => setMaxPriceInput(e.target.value)}
                className="form-input"
              />
              <button
                onClick={handleCustomPriceSearch}
                className="btn-primary cursor-pointer"
              >
                Tìm kiếm
              </button>
            </li>

            {/* Authentication Links */}
            {isLoggedIn ? (
              <>
                {isAdmin && (
                  <li>
                    <Link
                      href="/dashboard"
                      className="nav-link hover:text-gray-200 cursor-pointer"
                    >
                      Dashboard
                    </Link>
                  </li>
                )}
                <li>
                  <Link
                    href="/profile"
                    className="nav-link hover:text-gray-200 cursor-pointer"
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="btn-secondary cursor-pointer"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link href="/login" className="btn-primary cursor-pointer">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </nav>

        {/* Mobile Menu Icon */}
        <div className="sm:hidden">
          <button
            className="text-white focus:outline-none cursor-pointer"
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
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer"
                    onClick={toggleMobileMenu}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <select
                    value={selectedPriceRange}
                    onChange={handlePriceRangeChange}
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left bg-white cursor-pointer"
                  >
                    <option value="">Chọn khoảng giá</option>
                    {priceRanges.map((range) => (
                      <option key={range.label} value={range.label}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </li>
                <li>
                  <div className="flex flex-col">
                    <input
                      type="number"
                      placeholder="Giá tối thiểu"
                      value={minPriceInput}
                      onChange={(e) => setMinPriceInput(e.target.value)}
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left bg-white"
                    />
                    <input
                      type="number"
                      placeholder="Giá tối đa"
                      value={maxPriceInput}
                      onChange={(e) => setMaxPriceInput(e.target.value)}
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left bg-white"
                    />
                    <button
                      onClick={handleCustomPriceSearch}
                      className="cursor-pointer block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left bg-green-500 text-white"
                    >
                      Tìm kiếm
                    </button>
                  </div>
                </li>
                {isLoggedIn ? (
                  <>
                    {isAdmin && (
                      <li>
                        <Link
                          href="/dashboard"
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer"
                          onClick={toggleMobileMenu}
                        >
                          Dashboard
                        </Link>
                      </li>
                    )}
                    <li>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer"
                        onClick={toggleMobileMenu}
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          handleLogout();
                          toggleMobileMenu();
                        }}
                        className="bg-secondary-500 hover:bg-secondary-700 text-text font-bold py-2 px-4 rounded shadow-md transition-colors duration-200"
                      >
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <li>
                    <Link
                      href="/login"
                      className="bg-primary-500 hover:bg-primary-700 text-text font-bold py-2 px-4 rounded shadow-md transition-colors duration-200 inline-block"
                      onClick={toggleMobileMenu}
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
