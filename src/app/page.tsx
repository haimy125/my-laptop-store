"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { getServerCookie } from "./components/GetServerCookie";
import ProductList from "./components/ProductList";
import Header from "./components/Header";

function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState([]);
  const apiUrl = "http://localhost:8080/api/products/all";

  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  useEffect(() => {
    async function fetchToken() {
      const serverToken = await getServerCookie("jwtToken"); // Gọi server action
      if (serverToken) {
        setToken(serverToken);
      } else {
        const storedToken = Cookies.get("jwtToken"); // Lấy từ client nếu có
        setToken(storedToken || null);
      }
    }

    fetchToken();
  }, []);

  return (
    <div>
      <Header onSearchResults={handleSearchResults} />
      <ProductList products={searchResults} apiUrl={apiUrl} pageSize={8} />
    </div>
  );
}

export default Home;
