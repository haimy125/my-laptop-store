import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const jwtToken = request.cookies.get("jwtToken");

  // Kiểm tra xem người dùng đang truy cập trang chủ hay không
  if (request.nextUrl.pathname === "/") {
    // Không chuyển hướng nếu đang truy cập trang chủ
    return NextResponse.next(); // Cho phép request tiếp tục
  }

  if (jwtToken == undefined) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// export const config = {
//   matcher: ["/"], //Áp dụng middleware này cho trang chủ
// };

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     * 5. /login
     * 6. /register
     */
    "/((?!api|_next|_static|favicon.ico|login|register).*)",
  ],
};
