"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { getServerCookie } from "@/app/components/GetServerCookie";
import { setServerCookie } from "@/app/components/setServerCookie"; // Import hàm server

const OAuthSuccessPage = () => {
  const router = useRouter();

  useEffect(() => {
    const handleToken = async () => {
      const serverToken = await getServerCookie("jwtToken");
      console.log("Token nhận được:", serverToken);

      if (!serverToken) {
        console.error("Không tìm thấy token trong cookie.");
        router.replace("/login");
        return;
      }

      if (serverToken && !Cookies.get("jwtToken")) {
        await setServerCookie("jwtToken", serverToken, 7); // Lưu cookie ở server
        Cookies.set("jwtToken", serverToken, { expires: 7 }); // Đồng bộ với client
      }

      setTimeout(() => {
        router.replace("/"); // Chuyển trang
      }, 500);
    };

    handleToken().catch((error) => {
      console.error("Lỗi xử lý token:", error);
    });
  }, [router]);

  return (
    <div>
      <h1>Đang xử lý đăng nhập...</h1>
      <p>Vui lòng chờ...</p>
    </div>
  );
};

export default OAuthSuccessPage;
