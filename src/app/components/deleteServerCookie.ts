"use server";

import { cookies } from "next/headers";

export async function deleteServerCookie(cookieName: string) {
  const cookieStore = await cookies();
  cookieStore.set(cookieName, "", { path: "/", maxAge: 0 });
}
