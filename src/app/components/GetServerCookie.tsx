"use server";

import { cookies } from "next/headers";

export async function getServerCookie(cookieName: string) {
  const cookieStore = await cookies();
  return cookieStore.get(cookieName)?.value || null;
}
