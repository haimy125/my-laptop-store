"use server";

import { cookies } from "next/headers";

export async function setServerCookie(
  cookieName: string,
  value: string,
  days: number = 7
) {
  const cookieStore = cookies();
  await cookieStore.set(cookieName, value, {
    path: "/",
    maxAge: days * 24 * 60 * 60, // Chuyển đổi ngày thành giây
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Chỉ bật secure nếu ở production
  });
}
