"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { getServerCookie } from "./components/GetServerCookie";
export default function Home() {
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
      <h1>Trang chủ</h1>
    </div>
  );
}
