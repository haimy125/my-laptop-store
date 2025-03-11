"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { getServerCookie } from "./components/GetServerCookie";
import ProductList from "./components/ProductList";

function Home() {
  const [token, setToken] = useState<string | null>(null);

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

    fetchToken(); // Chạy khi component mount
  }, []);

  return (
    <div>
      <ProductList apiUrl="http://localhost:8080/api/products/all" />{" "}
      {/* Sử dụng component và truyền apiUrl */}
    </div>
  );
}

export default Home;
